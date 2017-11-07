package org.sweetest.platform.server.web;

import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;

import java.io.IOException;
import java.nio.file.Files;

public class MockConfig {
    @Bean
    @Qualifier("rootDirectory")
    @Primary
    public String getRootDirectory() {
        try {
            return Files.createTempDirectory("fs-testing").toString();
        } catch (IOException e) {
            return FileUtils.getTempDirectoryPath();
        }
    }
}
