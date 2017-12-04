package org.sweetest.platform.server.service.sakuli;

import org.apache.commons.lang.builder.ReflectionToStringBuilder;
import org.jooq.lambda.Unchecked;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.sweetest.platform.server.api.common.SakuliTestResultLogReader;
import org.sweetest.platform.server.api.file.FileSystemService;
import org.sweetest.platform.server.api.project.ProjectModel;
import org.sweetest.platform.server.api.project.ProjectService;
import org.sweetest.platform.server.api.runconfig.RunConfiguration;
import org.sweetest.platform.server.api.test.TestRunInfo;
import org.sweetest.platform.server.api.test.TestService;
import org.sweetest.platform.server.api.test.TestSuite;
import org.sweetest.platform.server.api.test.result.TestSuiteResult;
import org.sweetest.platform.server.service.test.execution.TestExecutionContext;
import org.sweetest.platform.server.service.test.execution.TestExecutionStrategyFactory;
import org.sweetest.platform.server.service.test.execution.config.SakuliRunConfigService;

import java.io.FileInputStream;
import java.nio.file.Paths;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Stream;

import static org.sweetest.platform.server.api.test.ToTestCaseCollector.toTestCases;

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
        return getTestSuite(projectService.getActiveProject().getPath()).get();
    }


    @Override
    public TestSuite getTestSuite(ProjectModel projectModel) {
        return getTestSuite(projectModel.getPath()).get();
    }

    @Override
    public Optional<TestSuite> getTestSuite(String path) {
        if (projectService.isValidProjectRoot(path)) {
            SakuliTestSuite testSuite = new SakuliTestSuite();

            testSuite.setRoot(path);
            testSuite.setName(path);

            SakuliTestSuiteConfiguration testsuiteProperties = new SakuliTestSuiteConfiguration();
            testsuiteProperties.setTestSuiteFile(Paths.get(path, SakuliProjectService.TESTSUITE_FILENAME).toString());
            testsuiteProperties.setPropertiesFile(Paths.get(path, SakuliProjectService.TESTPROPERTIES_FILENAME).toString());
            testSuite.setConfiguration(testsuiteProperties);
            applyPropertiesFileConfiguration(testSuite);

            testSuite.setConfigurationFiles(Arrays.asList(
                    testsuiteProperties.getPropertiesFile(),
                    testsuiteProperties.getTestSuiteFile()
            ));

            List<SakuliTestCase> testCases = getTestCases(testSuite);
            testSuite.setTestCases(testCases);
            return Optional.of(testSuite);
        } else {
            return Optional.empty();
        }
    }

    @Override
    public boolean saveTestSuite(ProjectModel project, SakuliTestSuite testSuite) {
        String testSuiteFileContent = getTestsuiteFileContents(testSuite);
        testSuite.getTestCases().forEach(tc -> {
            boolean exists = fileSystemService.getFileFromPath(
                    Paths.get(testSuite.getRoot(), tc.getName()).toString(), tc.getMainFile())
                    .isPresent();
            if(!exists) {
                fileSystemService.writeFile(
                        Paths.get(testSuite.getRoot(), tc.getName(), tc.getMainFile()).toString(),
                        "".getBytes()
                );
            }
        });
        return fileSystemService.writeFile(
                Paths.get(testSuite.getRoot(), SakuliProjectService.TESTSUITE_FILENAME).toString(),
                testSuiteFileContent.getBytes()
        );
    }

    private String getTestsuiteFileContents(SakuliTestSuite testSuite) {
        StringBuilder testSuiteFileContent = new StringBuilder();
        testSuite.getTestCases().forEach(tc -> {
            Arrays.stream(tc.getComment().split("\\n"))
                    .map(cl -> String.format("// %s\n", cl))
                    .forEach(testSuiteFileContent::append);
            testSuiteFileContent.append(String.format("%s%s/%s %s\n",
                    tc.isActive() ? "" : "// ",
                    tc.getName(),
                    tc.getMainFile(),
                    tc.getStartUrl()
            ));
        });
        return testSuiteFileContent.toString();
    }

    public TestRunInfo run(TestSuite testSuite, String workspace) {
        RunConfiguration runConfiguration = runConfigService.getRunConfigFromProject(testSuite.getRoot());
        return testExecutionStrategyFactory
                .getStrategyByRunConfiguration(runConfiguration)
                .map(strategy -> {
                    testExecutionContext.setStrategy(strategy);
                    return testExecutionContext.executeStrategy(testSuite, workspace, event -> {
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
        return fileSystemService
                .getFileLines(testSuite.getConfiguration().getTestSuiteFile())
                .orElse(Stream.empty())
                .collect(toTestCases());
    }

    private void applyPropertiesFileConfiguration(SakuliTestSuite testSuite) {
        Function<String, Long> parse = s -> null == s ? null : Long.parseLong(s);
        SakuliTestSuiteConfiguration testProperties = Optional
                .of(testSuite.getConfiguration())
                .orElse(new SakuliTestSuiteConfiguration());

        fileSystemService
                .getFileFromPath("", testSuite.getConfiguration().getPropertiesFile())
                .map(Unchecked.function(FileInputStream::new))
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
                .map(SakuliTestResultLogReader::new)
                .map(r -> r.read().getResultList())
                .orElse(new ArrayList<>());
    }

}
