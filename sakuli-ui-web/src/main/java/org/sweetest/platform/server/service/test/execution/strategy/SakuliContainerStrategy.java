package org.sweetest.platform.server.service.test.execution.strategy;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.dockerjava.api.command.CreateContainerCmd;
import com.github.dockerjava.api.command.InspectContainerResponse;
import com.github.dockerjava.api.model.Info;
import com.github.dockerjava.api.model.PullResponseItem;
import com.github.dockerjava.core.command.PullImageResultCallback;
import org.apache.commons.lang.builder.ReflectionToStringBuilder;
import org.apache.commons.lang.builder.ToStringStyle;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;
import org.springframework.web.context.WebApplicationContext;
import org.sweetest.platform.server.api.runconfig.SakuliExecutionConfiguration;
import org.sweetest.platform.server.api.test.execution.strategy.TestExecutionEvent;
import org.sweetest.platform.server.api.test.execution.strategy.events.DockerPullCompletedEvent;
import org.sweetest.platform.server.api.test.execution.strategy.events.DockerPullProgressEvent;
import org.sweetest.platform.server.api.test.execution.strategy.events.DockerPullStartedEvent;
import org.sweetest.platform.server.api.test.execution.strategy.events.TestExecutionErrorEvent;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Scope(value = WebApplicationContext.SCOPE_REQUEST, proxyMode = ScopedProxyMode.INTERFACES)
public class SakuliContainerStrategy extends AbstractContainerTestExecutionStrategy<SakuliExecutionConfiguration> {

    private static final Logger log = LoggerFactory.getLogger(SakuliContainerStrategy.class);
    private static final String INTERNAL_READY_TO_RUN = "internal.ready-to-run";


    private String containerImageName;

    private TestExecutionEvent readyToRun;


    @Override
    protected void executeContainerStrategy() {
        if(configuration.getContainer() == null) {
            throw new RuntimeException("Container is not configured");
        }
        containerImageName = String.format("%s/%s:%s",
                configuration.getContainer().getNamespace(),
                configuration.getContainer().getName(),
                Optional.ofNullable(configuration.getTag().getName()).orElse("latest")
        );
        readyToRun = new TestExecutionEvent(INTERNAL_READY_TO_RUN, "", executionId);

        //create "container run" call back
        subject.subscribe(e -> {
            if (e.equals(readyToRun)) {
                containerReference = createContainerConfig(containerImageName).exec();
                startContainer();
                Info i = dockerClient.infoCmd().exec();
                InspectContainerResponse response = dockerClient.inspectContainerCmd(containerReference.getId()).exec();
                log.info(
                        ReflectionToStringBuilder.toString(response, ToStringStyle.MULTI_LINE_STYLE)
                                + ReflectionToStringBuilder.toString(i, ToStringStyle.MULTI_LINE_STYLE)
                );
                attachToContainer();
            }
        });
        pullImage();
    }

    private boolean isPullingRequired() {
        return dockerClient.listImagesCmd()
                .withImageNameFilter(containerImageName)
                .exec()
                .isEmpty();
    }

    private void pullImage() {
        try {
            if (!isPullingRequired()) {
                log.info(String.format("Image %s already exists", containerImageName));
                next(readyToRun);
            } else {
                log.info(String.format("Image %s not found, try to pull it", containerImageName));
                next(new DockerPullStartedEvent(executionId));
                dockerClient
                        .pullImageCmd(containerImageName)
                        .withTag(configuration.getTag().getName())
                        .exec(new PullImageResultCallback() {
                            @Override
                            public void onNext(PullResponseItem item) {
                                //log.info("PullImageResultCallback:" + ReflectionToStringBuilder.toString(item));
                                ObjectMapper mapper = new ObjectMapper();
                                try {
                                    String pullResponse = mapper.writeValueAsString(item);
                                    next(new DockerPullProgressEvent(executionId, pullResponse));
                                } catch (JsonProcessingException e) {
                                    e.printStackTrace();
                                }
                                super.onNext(item);
                            }

                            @Override
                            public void onComplete() {
                                next(readyToRun);
                                next(new DockerPullCompletedEvent(executionId));
                                super.onComplete();
                            }
                        });
            }
        } catch (Exception e) {
            log.error(e.getClass().getSimpleName(), e);
            next(new TestExecutionErrorEvent(e.getMessage(), executionId, e));
        }

    }

    @Override
    protected CreateContainerCmd createContainerConfig(String containerImageName) {
        final List<String> configuredEnvVars = getConfiguration().getEnvironment().stream()
                .map(p -> String.format("%s=%s", p.getKey(), p.getValue()))
                .collect(Collectors.toList());

        return super.createContainerConfig(containerImageName)
                .withEnv(configuredEnvVars);
    }
}
