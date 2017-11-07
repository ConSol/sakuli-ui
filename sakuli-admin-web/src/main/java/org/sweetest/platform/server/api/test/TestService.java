package org.sweetest.platform.server.api.test;

import org.sweetest.platform.server.api.project.ProjectModel;
import org.sweetest.platform.server.api.test.result.TestSuiteResult;
import org.sweetest.platform.server.service.sakuli.SakuliTestSuite;

import java.util.List;
import java.util.Optional;

/**
 * Created by timkeiner on 19.07.17.
 */
public interface TestService {

    @Deprecated
    TestSuite getTestSuite();
    Optional<TestSuite> getTestSuite(String path);

    @Deprecated
    TestSuite getTestSuite(ProjectModel project);

    boolean saveTestSuite(ProjectModel project, SakuliTestSuite testSuite);

    TestRunInfo run(TestSuite testSuite);

    List<TestSuiteResult> getTestSuiteResults(String sakuliPath);
}
