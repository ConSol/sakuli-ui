package org.sweetest.platform.server.web;

import com.github.dockerjava.core.DockerClientConfig;
import org.apache.commons.lang.builder.ReflectionToStringBuilder;
import org.apache.commons.lang.builder.ToStringStyle;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/api/runtime")
public class RuntimeController {

    private static final Logger log = LoggerFactory.getLogger(RuntimeController.class);

    @Autowired
    private DockerClientConfig dockerClientConfig;

    @GetMapping("/docker")
    @ResponseBody
    public DockerClientConfig getDockerConfig() {
        log.info(ReflectionToStringBuilder.toString(dockerClientConfig, ToStringStyle.MULTI_LINE_STYLE));
        return dockerClientConfig;
    }
}
