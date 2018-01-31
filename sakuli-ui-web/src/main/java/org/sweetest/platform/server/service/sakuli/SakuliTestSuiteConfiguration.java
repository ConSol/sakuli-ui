package org.sweetest.platform.server.service.sakuli;

public class SakuliTestSuiteConfiguration {

    private String id;
    private String name;
    private Long warningTime;
    private Long criticalTime;
    private String browser;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getWarningTime() {
        return warningTime;
    }

    public void setWarningTime(Long warningTime) {
        this.warningTime = warningTime;
    }

    public Long getCriticalTime() {
        return criticalTime;
    }

    public void setCriticalTime(Long criticalTime) {
        this.criticalTime = criticalTime;
    }

    public String getBrowser() {
        return browser;
    }

    public void setBrowser(String browser) {
        this.browser = browser;
    }

    private String testSuiteFile;
    private String propertiesFile;

    public String getTestSuiteFile() {
        return testSuiteFile;
    }

    public void setTestSuiteFile(String testSuiteFile) {
        this.testSuiteFile = testSuiteFile;
    }

    public void setPropertiesFile(String propertiesFile) {
        this.propertiesFile = propertiesFile;
    }

    public String getPropertiesFile() {
        return propertiesFile;
    }
}