package org.sweetest.platform.server.service.sakuli;

import io.fabric8.docker.api.model.ContainerCreateResponse;
import io.fabric8.docker.api.model.HostConfig;
import io.fabric8.docker.api.model.PortBinding;
import io.fabric8.docker.api.model.VolumeBuilder;
import io.fabric8.docker.client.DockerClient;
import io.fabric8.docker.client.DockerClientException;
import io.fabric8.docker.dsl.EventListener;
import io.fabric8.docker.dsl.OutputHandle;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.builder.ReflectionToStringBuilder;
import org.apache.commons.lang.builder.ToStringStyle;
import org.jooq.lambda.Unchecked;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.sweetest.platform.server.api.file.FileSystemService;
import org.sweetest.platform.server.api.project.ProjectModel;
import org.sweetest.platform.server.api.project.ProjectService;
import org.sweetest.platform.server.api.test.TestCase;
import org.sweetest.platform.server.api.test.TestService;
import org.sweetest.platform.server.api.test.TestSuite;

import java.io.*;
import java.nio.file.Paths;
import java.util.*;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Created by timkeiner on 19.07.17.
 */
@Service
public class SakuliTestService implements TestService {

    private TestSuite testSuite;

    @Autowired
    private FileSystemService fileSystemService;

    @Autowired
    private ProjectService projectService;

    @Autowired
    private DockerClient dockerClient;

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
        applyPropertieFileConfiguration(testSuite);

        testSuite.setConfigurationFiles(Arrays.asList(
                testsuiteProperties.getPropertiesFile(),
                testsuiteProperties.getTestSuiteFile()
        ));


        List<SakuliTestCase> testCases = getTestCases(testSuite);
        testSuite.setTestCases(testCases);

        return testSuite;
    }


    public String run(TestSuite testSuite) {
        System.out.println(dockerClient);
        System.out.println(dockerClient.info().getName());

        Map<String, ArrayList<PortBinding>> portBinding = new HashMap<>();
        portBinding.put("5901/tcp", new ArrayList<>(Arrays.asList(new PortBinding("localhost", "5901"))));
        portBinding.put("6901/tcp", new ArrayList<>(Arrays.asList(new PortBinding("localhost", "6901"))));
        HostConfig hostConfig = new HostConfig();
        hostConfig.setPortBindings(portBinding);

        Map<String, Object> volumeMap = new HashMap<>();
        volumeMap.put(
                Paths.get("/Users/timkeiner/Projects/consol/TA/sakuli-examples/docker-xfce/part_01/example_xfce").toString(),
                new VolumeBuilder().withName("/opt/test").build());

        Map<String, String> envVariable = new HashMap<String, String>();
        envVariable.put("SAKULI_TEST_SUITE", "/opt/test");

        final CountDownLatch latch = new CountDownLatch(1);
        try {
            try (OutputHandle pullHandle = dockerClient
                    .image()
                    .withName("consol/sakuli-centos-xfce:dev")
                    .pull()
                    .usingListener(new EventListener() {
                        @Override
                        public void onSuccess(String s) {
                            System.out.println("---SUCC: " + s);
                            latch.countDown();
                        }

                        @Override
                        public void onError(String s) {
                            System.out.println("---ERR: " + s);
                            latch.countDown();
                        }

                        @Override
                        public void onEvent(String s) {
                            System.out.println("---EV: " + s);
                        }
                    }).fromRegistry()) {
                if (!latch.await(5, TimeUnit.MINUTES)) {
                    throw new DockerClientException("Failed to pull image [consol/sakuli-testsuites]");
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        ContainerCreateResponse container = dockerClient
                .container()
                .createNew()
                .withVolumes(volumeMap)
                .withUser("0")
                .withHostConfig(hostConfig)
                .withCmd("java -classpath /headless/sakuli/sakuli-v1.1.0-SNAPSHOT/libs/java/sakuli.jar:/headless/sakuli/sakuli-v1.1.0-SNAPSHOT/libs/java/* org.sakuli.starter.SakuliStarter --sakuli_home /headless/sakuli/sakuli-v1.1.0-SNAPSHOT --run /opt/test\n")
                .withImage("consol/sakuli-centos-xfce:dev")
                .withAttachStdout(true)
                .withAttachStderr(true)
                .done();

        System.out.println(container);

        if (dockerClient.container().withName(container.getId()).start()) {
            System.out.println("Started");
            dockerClient.container().withName(container.getId())
                    .logs()
                    .writingOutput(System.out)
                    .writingError(System.err)
                    .follow()
            ;
        } else {
            System.out.println("Error");
        }

        return "";
    }

    // docker cp sakuli 1f0127260c76:/headless/sakuli/sakuli-v1.1.0-beta/bin/sakuli

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

    private void applyPropertieFileConfiguration(SakuliTestSuite testSuite) {
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

}
