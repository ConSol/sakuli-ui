package org.sweetest.platform.server.api.test;

import org.sweetest.platform.server.api.project.ProjectModel;

/**
 * Created by timkeiner on 19.07.17.
 */
public interface TestService {

    TestSuite getTestSuite();
    TestSuite getTestSuite(ProjectModel project);

    String run(TestSuite testSuite);

}
