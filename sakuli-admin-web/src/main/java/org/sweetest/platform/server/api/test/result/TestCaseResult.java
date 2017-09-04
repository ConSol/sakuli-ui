package org.sweetest.platform.server.api.test.result;

import java.util.ArrayList;
import java.util.List;

public class TestCaseResult extends BaseResult {
    private String id;
    private String startUrl;
    private String endUrl;
    private List<TestCaseStepResult> stepResults = new ArrayList<>();

    public TestCaseStepResult latestStepResult() {
        if(stepResults.isEmpty()) {
            stepResults.add(new TestCaseStepResult());
        }
        return stepResults.get(stepResults.size() - 1);
    }

    public List<TestCaseStepResult> getStepResults() {
        return stepResults;
    }

    public void setStepResults(List<TestCaseStepResult> stepResults) {
        this.stepResults = stepResults;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getStartUrl() {
        return startUrl;
    }

    public void setStartUrl(String startUrl) {
        this.startUrl = startUrl;
    }

    public String getEndUrl() {
        return endUrl;
    }

    public void setEndUrl(String endUrl) {
        this.endUrl = endUrl;
    }
}
