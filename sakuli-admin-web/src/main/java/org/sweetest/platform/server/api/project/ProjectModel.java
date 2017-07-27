package org.sweetest.platform.server.api.project;

import org.sweetest.platform.server.api.test.TestSuite;

/**
 * Created by timkeiner on 19.07.17.
 */
public class ProjectModel {
    private String name;
    private String path;
    private TestSuite testSuite;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public TestSuite getTestSuite() {
        return testSuite;
    }

    public void setTestSuite(TestSuite testSuite) {
        this.testSuite = testSuite;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

}
