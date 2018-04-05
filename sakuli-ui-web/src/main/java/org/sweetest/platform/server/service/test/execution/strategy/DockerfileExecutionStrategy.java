package org.sweetest.platform.server.service.test.execution.strategy;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.dockerjava.api.model.BuildResponseItem;
import com.github.dockerjava.core.command.BuildImageResultCallback;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;
import org.springframework.web.context.WebApplicationContext;
import org.sweetest.platform.server.api.file.FileSystemService;
import org.sweetest.platform.server.api.runconfig.DockerFileExecutionConfiguration;
import org.sweetest.platform.server.api.test.execution.strategy.events.DockerPullCompletedEvent;
import org.sweetest.platform.server.api.test.execution.strategy.events.DockerPullProgressEvent;
import org.sweetest.platform.server.api.test.execution.strategy.events.DockerPullStartedEvent;
import org.sweetest.platform.server.api.test.execution.strategy.events.TestExecutionErrorEvent;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.Optional;

@Service
@Scope(value = WebApplicationContext.SCOPE_REQUEST, proxyMode = ScopedProxyMode.INTERFACES)
public class DockerfileExecutionStrategy extends AbstractContainerTestExecutionStrategy<DockerFileExecutionConfiguration> {

    private static Logger log = LoggerFactory.getLogger(DockerfileExecutionStrategy.class);

    @Autowired
    private FileSystemService fileSystemService;

    @Override
    protected void executeContainerStrategy() {
        Optional<File> dockerfile = fileSystemService.getFileFromPath(
                testSuite.getRoot(),
                getConfiguration().getFile());
        if (dockerfile.isPresent()) {
            //TODO refactor thread execution
            new Thread(() -> {
                next(new DockerPullStartedEvent(executionId));
                try {
                    log.info("Start docker build for file: {}", dockerfile.get().toPath().toString());
                    String imageId = buildDockerImage(dockerfile.get());
                    log.info("docker build finished: image-event={}", imageId);
                    containerReference = createContainerConfig(imageId).exec();
                    startContainer();
                    attachToContainer();
                } catch (Exception e) {
                    next(new TestExecutionErrorEvent(e.getMessage(), executionId, e));
                }
            }).start();
        } else {
            next(new TestExecutionErrorEvent("dockerfile is not present!", executionId, new FileNotFoundException("File not found: " + testSuite.getRoot() + "/" +
                    getConfiguration().getFile())));
        }
    }

    private String buildDockerImage(File file) {
        return dockerClient
                .buildImageCmd(file)
                .exec(new BuildImageResultCallback() {
                    @Override
                    public void onNext(BuildResponseItem item) {
                        ObjectMapper mapper = new ObjectMapper();
                        try {
                            String buildResponse = mapper.writeValueAsString(item);
                            next(new DockerPullProgressEvent(executionId, buildResponse));
                        } catch (JsonProcessingException e) {
                            e.printStackTrace();
                        }
                        super.onNext(item);
                    }

                    @Override
                    public void onComplete() {
                        next(new DockerPullCompletedEvent(executionId));
                        super.onComplete();
                    }
                }).awaitImageId();
    }
}
