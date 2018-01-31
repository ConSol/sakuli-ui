package org.sweetest.platform.server.api.test.result;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

public class TestSuiteResult extends BaseResult {

    private String id;
    private String guid;
    private String browserInfo = "";
    private String host;
    private String dbJobPrimaryKey;
    private String testSuiteFolder;
    private String testSuiteFile;

    @JsonIgnore
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

    public String getBrowserInfo() {
        return browserInfo;
    }

    public void setBrowserInfo(String browserInfo) {
        this.browserInfo = browserInfo;
    }

    public List<TestCaseResult> getTestCaseResults() {
        return testCaseResults;
    }

    public String getBrowserName() {
        return browserInfo.split(" ")[0];
    }

    public void setTestCaseResults(List<TestCaseResult> testCaseResults) {
        this.testCaseResults = testCaseResults;
    }

    public Map<String, TestCaseResult> getTestCases() {
        return testCaseResults.stream().collect(Collectors.toMap(
                tcr -> tcr.getName(),
                Function.identity()
        ));
    }

    public TestCaseResult latestTestCaseResult() {
        if (this.testCaseResults.isEmpty()) {
            this.testCaseResults.add(new TestCaseResult());
        }
        return this.testCaseResults.get(this.testCaseResults.size() - 1);
    }

    public String getHost() {
        return host;
    }

    public void setHost(String host) {
        this.host = host;
    }

    public String getDbJobPrimaryKey() {
        return dbJobPrimaryKey;
    }

    public void setDbJobPrimaryKey(String dbJobPrimaryKey) {
        this.dbJobPrimaryKey = dbJobPrimaryKey;
    }

    public String getTestSuiteFolder() {
        return testSuiteFolder;
    }

    public void setTestSuiteFolder(String testSuiteFolder) {
        this.testSuiteFolder = testSuiteFolder;
    }

    public String getTestSuiteFile() {
        return testSuiteFile;
    }

    public void setTestSuiteFile(String testSuiteFile) {
        this.testSuiteFile = testSuiteFile;
    }
}
