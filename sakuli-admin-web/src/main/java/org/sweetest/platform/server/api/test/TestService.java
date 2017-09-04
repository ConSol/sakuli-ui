package org.sweetest.platform.server.api.test;

import org.sweetest.platform.server.api.project.ProjectModel;
import org.sweetest.platform.server.api.test.result.TestSuiteResult;

import java.util.List;

/**
 * Created by timkeiner on 19.07.17.
 */
public interface TestService {

    TestSuite getTestSuite();
    TestSuite getTestSuite(ProjectModel project);

    TestRunInfo run(TestSuite testSuite);

    List<TestSuiteResult> getTestSuiteResults(String sakuliPath);
}
