package org.sweetest.platform.server.service.test.execution.config.dockercompose;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.util.HashMap;
import java.util.Optional;


public class DockerComposeParser {

    private static final Logger log = LoggerFactory.getLogger(DockerComposeParser.class);

    public static Optional<DockerComposeModel> fromFile(File file) {
        ObjectMapper mapper = new ObjectMapper(new YAMLFactory());
        try {
            DockerComposeModel model = mapper.readValue(file, DockerComposeModel.class);
            if(model.getServices() == null && model.getVersion() == null) {
                TypeReference<HashMap<String, DockerComposeServiceModel>> serviceMapRef = new TypeReference<HashMap<String, DockerComposeServiceModel>>() {};

                HashMap<String, DockerComposeServiceModel> serviceModelHashMap = mapper.readValue(file, serviceMapRef);
                model.setServices(serviceModelHashMap);
            }
            return Optional.of(model);
        } catch (Exception e) {
            log.warn("Error while parsing " + file.getAbsolutePath(), e);
            return Optional.empty();
        }
    }

}
