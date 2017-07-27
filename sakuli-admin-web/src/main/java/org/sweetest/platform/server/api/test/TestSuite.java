package org.sweetest.platform.server.api.test;

import org.sweetest.platform.server.api.project.ProjectModel;

import java.util.List;

/**
 * Created by timkeiner on 19.07.17.
 */
public class TestSuite<C, T extends TestCase> {

    private String name;
    private List<T> testCases;
    private List<String> configurationFiles;
    private C configuration;
    private String root;

    public List<T> getTestCases() {
        return testCases;
    }

    public void setTestCases(List<T> testCases) {
        this.testCases = testCases;
    }

    public C getConfiguration() {
        return configuration;
    }

    public void setConfiguration(C configuration) {
        this.configuration = configuration;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<String> getConfigurationFiles() {
        return configurationFiles;
    }

    public void setConfigurationFiles(List<String> configurationFiles) {
        this.configurationFiles = configurationFiles;
    }

    public String getRoot() {
        return root;
    }

    public void setRoot(String root) {
        this.root = root;
    }
}
