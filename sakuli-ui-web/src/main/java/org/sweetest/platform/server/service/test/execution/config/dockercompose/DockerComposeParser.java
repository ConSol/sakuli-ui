package org.sweetest.platform.server.service.test.execution.config.dockercompose;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.sweetest.platform.server.api.test.TestRunInfoPorts;

import java.io.File;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


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

    public static List<TestRunInfoPorts> readPortsFromModel(DockerComposeModel dockerComposeModel) {
        return dockerComposeModel
                .getServices().entrySet().stream()
                .map(e -> {
                    TestRunInfoPorts trip = new TestRunInfoPorts();
                    getPortMappingModelByTargetPort(e.getValue(), 5901).ifPresent(trip::setVnc);
                    getPortMappingModelByTargetPort(e.getValue(), 6901).ifPresent(trip::setWeb);
                    return trip;
                })
                .filter(trip -> trip.getVnc() >= 0 || trip.getWeb() >= 0)
                .collect(Collectors.toList());
    }

    private static Optional<Integer> getPortMappingModelByTargetPort(DockerComposeServiceModel serviceModel, int targetPort) {
        return serviceModel.getPorts().stream()
                .filter(p -> p.getTarget() == targetPort)
                .findFirst().map(DockerComposeServicePortMappingModel::getPublished);
    }

}
