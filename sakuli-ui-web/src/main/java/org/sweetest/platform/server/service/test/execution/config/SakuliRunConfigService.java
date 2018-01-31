package org.sweetest.platform.server.service.test.execution.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.jooq.lambda.Unchecked;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.sweetest.platform.server.api.file.FileSystemService;
import org.sweetest.platform.server.api.runconfig.RunConfiguration;

import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;

@Service
public class SakuliRunConfigService {

    private static final Logger log = LoggerFactory.getLogger(SakuliRunConfigService.class);

    static final private String FILE_NAME = ".sakuli-admin.json";

    @Autowired
    private FileSystemService fileSystemService;

    public RunConfiguration getRunConfigFromProject(String path) {
        return fileSystemService
                .getFileFromPath(path, FILE_NAME)
                .map(Unchecked.function(f -> {
                    ObjectMapper mapper = new ObjectMapper();
                    return mapper.readValue(f, RunConfiguration.class);
                }))
                .orElse(new RunConfiguration());
    }

    public boolean setRunConfigurationToProject(RunConfiguration runConfiguration, String path) {
        ObjectMapper mapper = new ObjectMapper();
        File file = fileSystemService.getFileFromPath(path, FILE_NAME)
                .orElseGet(() -> {
                    fileSystemService.writeFile(Paths.get(path, FILE_NAME).toString(), new byte[0]);
                    return fileSystemService.getFileFromPath(path, FILE_NAME).get();
                });
        try {
            if (!file.exists()) {
                file.createNewFile();
            }
            mapper.writeValue(
                    file,
                    runConfiguration
            );
            return true;
        } catch (IOException e) {
            log.info("Unable to store run-config to " + FILE_NAME);
            e.printStackTrace();
            return false;
        }
    }


}
