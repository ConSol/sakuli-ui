package org.sweetest.platform.server.service.test.execution;

import org.springframework.stereotype.Service;
import org.sweetest.platform.server.api.test.TestRunInfo;

import java.util.HashMap;
import java.util.Map;

@Service
public class TestExecutionInstancesService {

    Map<String, TestRunInfo> testRunInfoMap = new HashMap<>();

    public TestRunInfo get(String key) {
        return testRunInfoMap.get(key);
    }

    public TestRunInfo put(String key, TestRunInfo value) {
        return testRunInfoMap.put(key, value);
    }

    public TestRunInfo remove(String key) {
        return testRunInfoMap.remove(key);
    }

    public boolean containsKey(String key) {
        return testRunInfoMap.containsKey(key);
    }
}
