package org.sweetest.platform.server.service.sakuli;

import org.sweetest.platform.server.api.test.TestSuite;

public class SakuliTestSuite extends TestSuite<SakuliTestSuiteConfiguration, SakuliTestCase> {

    private String configurationFile;
    private String testSuiteFile;

    public String getConfigurationFile() {
        return configurationFile;
    }

    public void setConfigurationFile(String configurationFile) {
        this.configurationFile = configurationFile;
    }

    public String getTestSuiteFile() {
        return testSuiteFile;
    }

    public void setTestSuiteFile(String testSuiteFile) {
        this.testSuiteFile = testSuiteFile;
    }

    public String getId() {
        return getConfiguration().getId();
    }
}
