package org.sweetest.platform.server.service.sakuli;

import org.sweetest.platform.server.api.test.TestCase;

public class SakuliTestCase extends TestCase<SakuliTestCaseConfiguration> {

    private String comment = "";

    private String startUrl = "";

    private boolean active = false;
    private String mainFile;

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public String getStartUrl() {
        return startUrl;
    }

    public void setStartUrl(String startUrl) {
        this.startUrl = startUrl;
    }

    public void setMainFile(String mainFile) {
        this.mainFile = mainFile;
    }

    public String getMainFile() {
        return mainFile;
    }

}