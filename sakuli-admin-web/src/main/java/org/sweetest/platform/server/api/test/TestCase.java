package org.sweetest.platform.server.api.test;

import java.util.List;

/**
 * Created by timkeiner on 19.07.17.
 */
public class TestCase<C> {

    private C configuration;
    private String name;
    private List<String> sourceFiles;
    private List<String> assetFiles;
    private List<String> configurationFiles;

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

    public List<String> getSourceFiles() {
        return sourceFiles;
    }

    public void setSourceFiles(List<String> sourceFiles) {
        this.sourceFiles = sourceFiles;
    }

    public List<String> getAssetFiles() {
        return assetFiles;
    }

    public void setAssetFiles(List<String> assetFiles) {
        this.assetFiles = assetFiles;
    }

    public List<String> getConfigurationFiles() {
        return configurationFiles;
    }

    public void setConfigurationFiles(List<String> configurationFiles) {
        this.configurationFiles = configurationFiles;
    }
}
