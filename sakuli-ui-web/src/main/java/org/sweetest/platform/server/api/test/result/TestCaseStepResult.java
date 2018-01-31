package org.sweetest.platform.server.api.test.result;

public class TestCaseStepResult extends BaseResult {
    private String errorScreenshot;

    public String getErrorScreenshot() {
        return errorScreenshot;
    }

    public void setErrorScreenshot(String errorScreenshot) {
        this.errorScreenshot = errorScreenshot;
    }
}
