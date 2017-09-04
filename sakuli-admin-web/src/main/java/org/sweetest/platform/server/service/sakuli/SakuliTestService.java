package org.sweetest.platform.server.service.sakuli;

import com.github.dockerjava.api.DockerClient;
import com.github.dockerjava.api.command.CreateContainerResponse;
import com.github.dockerjava.api.model.*;
import com.github.dockerjava.core.command.AttachContainerResultCallback;
import com.github.dockerjava.core.command.EventsResultCallback;
import org.apache.commons.lang.builder.ReflectionToStringBuilder;
import org.apache.commons.lang.builder.ToStringStyle;
import org.jooq.lambda.Unchecked;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.SocketUtils;
import org.sweetest.platform.server.api.file.FileSystemService;
import org.sweetest.platform.server.api.project.ProjectModel;
import org.sweetest.platform.server.api.project.ProjectService;
import org.sweetest.platform.server.api.test.TestRunInfo;
import org.sweetest.platform.server.api.test.TestService;
import org.sweetest.platform.server.api.test.TestSuite;
import org.sweetest.platform.server.api.test.result.TestSuiteResult;
import org.sweetest.platform.server.common.SakuliTestResultLogReader;
import org.sweetest.platform.server.service.SocketEvent;

import java.io.File;
import java.io.FileInputStream;
import java.nio.file.Paths;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

import static com.github.dockerjava.api.model.Ports.Binding.bindPort;

/**
 * Created by timkeiner on 19.07.17.
 */
@Service
public class SakuliTestService implements TestService {

    private static final Logger log = LoggerFactory.getLogger(SakuliTestService.class);


    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    private FileSystemService fileSystemService;

    @Autowired
    private ProjectService projectService;

    @Autowired
    private DockerClient dockerClient;

    private String rootDirectory;

    @Autowired
    public SakuliTestService(@Qualifier("rootDirectory") String rootDirectory) {
        this.rootDirectory = rootDirectory;
    }

    @Override
    public TestSuite getTestSuite() {
        return getTestSuite(projectService.getActiveProject());
    }

    @Override
    public TestSuite getTestSuite(ProjectModel project) {
        SakuliTestSuite testSuite = new SakuliTestSuite();

        testSuite.setRoot(project.getPath());
        testSuite.setName(project.getPath());

        SakuliTestSuiteConfiguration testsuiteProperties = new SakuliTestSuiteConfiguration();
        testsuiteProperties.setTestSuiteFile(Paths.get(project.getPath(), SakuliProjectService.TESTSUITE_FILENAME).toString());
        testsuiteProperties.setPropertiesFile(Paths.get(project.getPath(), SakuliProjectService.TESTPROPERTIES_FILENAME).toString());
        testSuite.setConfiguration(testsuiteProperties);
        applyPropertiesFileConfiguration(testSuite);

        testSuite.setConfigurationFiles(Arrays.asList(
                testsuiteProperties.getPropertiesFile(),
                testsuiteProperties.getTestSuiteFile()
        ));

        List<SakuliTestCase> testCases = getTestCases(testSuite);
        testSuite.setTestCases(testCases);

        return testSuite;
    }

    private class ContainerCallBack extends AttachContainerResultCallback {

        private String containerID;

        public ContainerCallBack(String containerID) {
            this.containerID = containerID;
        }

        @Override
        public void onNext(Frame item) {
            String destination = "/topic/test-run-info/" + this.containerID;
            SocketEvent socketEvent = new SocketEvent(this.containerID, new String(item.getPayload()));
            simpMessagingTemplate.convertAndSend(
                    destination,
                    socketEvent);
            log.info(String.format("%s: %s", destination, socketEvent));
            super.onNext(item);
        }
    }


    public TestRunInfo run(TestSuite testSuite) {
        Info info = dockerClient.infoCmd().exec();
        log.info(ReflectionToStringBuilder.toString(info, ToStringStyle.MULTI_LINE_STYLE));
        final String pathInImage = ("/" + testSuite.getRoot()).replace("//", "/");
        final Volume volume = new Volume(pathInImage);
        final ExposedPort vncPort = ExposedPort.tcp(5901);
        final ExposedPort vncWebPort = ExposedPort.tcp(6901);
        final Ports ports = new Ports();
        final int availableVncPort = SocketUtils.findAvailableTcpPort(5901, 6900);
        final int availableVncWebPort = SocketUtils.findAvailableTcpPort(6901);
        ports.bind(vncPort, bindPort(availableVncPort));
        ports.bind(vncWebPort, bindPort(availableVncWebPort));

        EventsResultCallback eventsResultCallback = new EventsResultCallback() {
            @Override
            public void onNext(Event item) {
                log.info("Event: " + item);
                if (item.getAction().equals("disconnect")) {
                    super.onComplete();
                } else {
                    super.onNext(item);
                }
            }
        };

        try {
            dockerClient.eventsCmd().exec(eventsResultCallback);
            CreateContainerResponse container = dockerClient
                    .createContainerCmd("consol/sakuli-ubuntu-xfce:dev")
                    .withCmd("run", pathInImage)
                    .withExposedPorts(vncPort, vncWebPort)
                    .withPortBindings(ports)
                    .withPublishAllPorts(true)
                    .withVolumes(volume)
                    .withBinds(new Bind(Paths.get(rootDirectory, testSuite.getRoot()).toString(), volume))
                    .exec();
            dockerClient.startContainerCmd(container.getId()).exec();
            Optional.ofNullable(container.getWarnings()).map(s -> ReflectionToStringBuilder.toString(s))
                    .ifPresent(w -> log.warn(w));

            ContainerCallBack logCb = new ContainerCallBack(container.getId());
            dockerClient
                    .logContainerCmd(container.getId())
                    .withStdOut(true)
                    .withStdErr(true)
                    .withTailAll()
                    .withFollowStream(true)
                    .exec(logCb);

            dockerClient.infoCmd().exec().getNoProxy();
            return new TestRunInfo(
                    availableVncPort,
                    availableVncWebPort,
                    container.getId()
            );
        } catch (Exception e) {
            log.error(e.getMessage());
        }
        return new TestRunInfo(0,0,"");
    }

    private List<SakuliTestCase> getTestCases(SakuliTestSuite testSuite) {
        return Optional.of(testSuite)
                .flatMap(p -> fileSystemService.getFileLines(p.getConfiguration().getTestSuiteFile()))
                .map(lines -> lines
                        .map(l -> l.trim())
                        .filter(l -> !l.startsWith("//"))
                        .map(l -> l.split(" ", 2))
                        .filter(l -> l.length == 2)
                        .map(settings -> {
                            SakuliTestCase testCase = new SakuliTestCase();
                            testCase.setName(settings[0]);
                            SakuliTestCaseConfiguration sakuliTestCaseConfiguration = new SakuliTestCaseConfiguration();
                            sakuliTestCaseConfiguration.setUrl(settings[1]);
                            testCase.setConfiguration(sakuliTestCaseConfiguration);

                            String s = Paths.get(testSuite.getRoot(), settings[0]).getParent().toString();
                            System.out.println(s);
                            testCase.setSourceFiles(Arrays.asList(Paths.get(testSuite.getRoot(), settings[0]).toString()));
                            testCase.setAssetFiles(fileSystemService
                                    .getFiles(s)
                                    .map(FileSystemService.toFileModel.apply(s))
                                    .peek(as -> System.out.println(as))
                                    .map(f -> Paths.get(f.getPath(), f.getName()).toString())
                                    .collect(Collectors.toList())
                            );
                            return testCase;
                        })
                        .collect(Collectors.toList())
                )
                .orElse(Arrays.asList());
    }

    private void applyPropertiesFileConfiguration(SakuliTestSuite testSuite) {
        Function<String, Long> parse = s -> null == s ? null : Long.parseLong(s);
        SakuliTestSuiteConfiguration testProperties = Optional
                .of(testSuite.getConfiguration())
                .orElse(new SakuliTestSuiteConfiguration());

        fileSystemService
                .getFileFromPath("", testSuite.getConfiguration().getPropertiesFile())
                .map(Unchecked.<File, FileInputStream>function((File f) -> new FileInputStream(f)))
                .ifPresent(Unchecked.consumer(propertiesInputStream -> {
                    Properties properties = new Properties();
                    properties.load(propertiesInputStream);

                    testProperties.setId(properties.getProperty("testsuite.id"));
                    testProperties.setName(properties.getProperty("testsuite.name"));
                    testProperties.setCriticalTime(parse.apply(properties.getProperty("testsuite.criticalTime")));
                    testProperties.setWarningTime(parse.apply(properties.getProperty("testsuite.warningTime")));
                    testProperties.setBrowser(properties.getProperty("testsuite.browser"));
                    testSuite.setConfiguration(testProperties);
                }));

    }

    public List<TestSuiteResult> getTestSuiteResults(String testSuitePath) {
        return fileSystemService
                .getFileFromPath(
                        Paths.get(testSuitePath, "_logs").toString(),
                        "_sakuli.log"
                )
                .map(f -> new SakuliTestResultLogReader(f))
                .map(r -> r.read().getResultList())
                .orElse(new ArrayList<>());
    }

}
