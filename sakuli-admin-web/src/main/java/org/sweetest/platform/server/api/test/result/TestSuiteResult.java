package org.sweetest.platform.server.api.test.result;

import org.sweetest.platform.server.api.test.TestCase;

import java.util.ArrayList;
import java.util.List;

public class TestSuiteResult extends BaseResult {

    private String id;
    private String guid;
    private String browser;
    private List<TestCaseResult> testCaseResults = new ArrayList<>();

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getGuid() {
        return guid;
    }

    public void setGuid(String guid) {
        this.guid = guid;
    }

    public String getBrowser() {
        return browser;
    }

    public void setBrowser(String browser) {
        this.browser = browser;
    }

    public List<TestCaseResult> getTestCaseResults() {
        return testCaseResults;
    }

    public void setTestCaseResults(List<TestCaseResult> testCaseResults) {
        this.testCaseResults = testCaseResults;
    }

    public TestCaseResult latestTestCaseResult() {
        if(this.testCaseResults.isEmpty()) {
            this.testCaseResults.add(new TestCaseResult());
        }
        return this.testCaseResults.get(this.testCaseResults.size() - 1);
    }
}
