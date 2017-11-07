package org.sweetest.platform.server.web;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.commons.io.FileUtils;
import org.junit.After;
import org.junit.Before;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.sweetest.platform.server.Application;

import java.io.File;
import java.io.IOException;

@RunWith(SpringRunner.class)
@SpringBootTest(
        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
        classes = {Application.class, MockConfig.class})
@AutoConfigureMockMvc
public class AbstractControllerTestWithFileSystem {

    @Autowired
    protected MockMvc mvc;

    @Autowired
    protected String rootDirectory;

    public String getInitDirectory() {
        return getClass().getResource("fs/_init").getPath();
    }

    @Before
    public void initFileSystem() throws IOException {
        FileUtils.copyDirectory(
                new File(getInitDirectory()),
                new File(rootDirectory)
        );
    }

    @After
    public void tearDownFileSystem() throws IOException {
        FileUtils.cleanDirectory(new File(rootDirectory));
    }

    public static String asJsonString(final Object obj) {
        try {
            final ObjectMapper mapper = new ObjectMapper();
            final String jsonContent = mapper.writeValueAsString(obj);
            return jsonContent;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
