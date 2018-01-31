package org.sweetest.platform.server.api.test.result;

import java.util.ArrayList;
import java.util.List;

public class TestCaseResult extends BaseResult {
    private String id;
    private String startUrl;
    private String lastUrl;
    private List<TestCaseStepResult> steps = new ArrayList<>();
    private List<TestActionResult> testActions = new ArrayList<>();

    public TestCaseStepResult latestStepResult() {
        if(steps.isEmpty()) {
            steps.add(new TestCaseStepResult());
        }
        return steps.get(steps.size() - 1);
    }

    public List<TestCaseStepResult> getSteps() {
        return steps;
    }

    public void setSteps(List<TestCaseStepResult> steps) {
        this.steps = steps;
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

    public String getLastUrl() {
        return lastUrl;
    }

    public void setLastUrl(String lastUrl) {
        this.lastUrl = lastUrl;
    }

    public List<TestActionResult> getTestActions() {
        return testActions;
    }

    public void setTestActions(List<TestActionResult> testActions) {
        this.testActions = testActions;
    }
}
