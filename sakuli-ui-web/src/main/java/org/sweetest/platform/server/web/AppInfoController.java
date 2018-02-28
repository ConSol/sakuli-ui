package org.sweetest.platform.server.web;

import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.schema.JsonSchema;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.sweetest.platform.server.api.AppInfo;
import org.sweetest.platform.server.service.AppInfoService;

@Controller
@RequestMapping("/api/info")
public class AppInfoController {

    private static final Logger log = LoggerFactory.getLogger(AppInfoController.class);

    @Autowired
    private AppInfoService appInfoService;

    @GetMapping
    @ResponseBody
    public AppInfo getDockerConfig() {
        return appInfoService.getAppInfo();
    }

    @GetMapping("schema")
    @ResponseBody
    public JsonSchema schema() throws JsonMappingException {
        ObjectMapper mapper = new ObjectMapper();
        JsonSchema schema = mapper.generateJsonSchema(AppInfo.class);
        return schema;
    }
}
