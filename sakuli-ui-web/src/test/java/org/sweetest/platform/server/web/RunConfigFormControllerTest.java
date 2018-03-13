package org.sweetest.platform.server.web;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Value;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class RunConfigFormControllerTest extends AbstractControllerTestWithFileSystem{

    @Value("${app.authentication.enabled}")
    private String authEnabled;

    @Test
    public void getSchema() throws Exception {
        System.out.println(String.format("Auth is %s", authEnabled ));

        mvc.perform(get("/api/forms/runconfig/schema"))
                .andExpect(status().isOk())
               ;


    }


}