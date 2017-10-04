package org.sweetest.platform.server.service.sakuli;

import org.apache.commons.lang.builder.ReflectionToStringBuilder;
import org.jooq.lambda.Unchecked;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.sweetest.platform.server.api.file.FileSystemService;
import org.sweetest.platform.server.api.project.ProjectModel;
import org.sweetest.platform.server.api.project.ProjectService;
import org.sweetest.platform.server.api.runconfig.RunConfiguration;
import org.sweetest.platform.server.api.test.TestRunInfo;
import org.sweetest.platform.server.api.test.TestService;
import org.sweetest.platform.server.api.test.TestSuite;
import org.sweetest.platform.server.api.test.result.TestSuiteResult;
import org.sweetest.platform.server.api.common.SakuliTestResultLogReader;
import org.sweetest.platform.server.service.test.execution.TestExecutionContext;
import org.sweetest.platform.server.service.test.execution.TestExecutionStrategyFactory;
import org.sweetest.platform.server.service.test.execution.config.SakuliRunConfigService;

import java.io.File;
import java.io.FileInputStream;
import java.nio.file.Paths;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Created by timkeiner on 19.07.17.
 */
@Service
public class SakuliTestService implements TestService {

    private static final Logger log = LoggerFactory.getLogger(SakuliTestService.class);

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    private TestExecutionStrategyFactory testExecutionStrategyFactory;

    @Autowired
    private FileSystemService fileSystemService;

    @Autowired
    private ProjectService projectService;

    @Autowired
    private SakuliRunConfigService runConfigService;

    @Autowired
    private TestExecutionContext testExecutionContext;

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

    public TestRunInfo run(TestSuite testSuite) {
        ProjectModel projectModel = projectService.getActiveProject();
        RunConfiguration runConfiguration = runConfigService.getRunConfigFromProject(projectModel);
        return testExecutionStrategyFactory
                .getStrategyByRunConfiguration(runConfiguration)
                .map(strategy -> {
                    testExecutionContext.setStrategy(strategy);
                    return testExecutionContext.executeStrategy(testSuite, event -> {
                        log.info(ReflectionToStringBuilder.toString(event));
                        simpMessagingTemplate.convertAndSend(
                                "/topic/test-run-info/" + event.getProcessId(),
                                event
                        );
                    });
                })
                .orElse(null);
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
