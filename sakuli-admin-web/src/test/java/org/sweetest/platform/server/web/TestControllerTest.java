package org.sweetest.platform.server.web;

import org.apache.commons.io.FileUtils;
import org.hamcrest.Matchers;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.sweetest.platform.server.api.file.FileSystemService;
import org.sweetest.platform.server.api.test.TestSuite;
import org.sweetest.platform.server.service.sakuli.SakuliTestCase;
import org.sweetest.platform.server.service.sakuli.SakuliTestSuite;

import java.nio.file.Paths;
import java.util.Arrays;
import java.util.Optional;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class TestControllerTest extends AbstractControllerTestWithFileSystem{

    @Autowired
    FileSystemService fileSystemService;

    @Test
    public void getTest() throws Exception {
    }

    @Test
    public void getTestSuite() throws Exception {
        mvc.perform(get("/api/testsuite?path=project"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.testCases", hasSize(1)))
                .andExpect(jsonPath("$.name", is("project")))
                .andExpect(jsonPath("$.configuration.testSuiteFile", is("project/testsuite.suite")))
                .andExpect(jsonPath("$.testCases[0].name", is("case1")))
                .andExpect(jsonPath("$.testCases[0].mainFile", is("sakuli_demo.js")))
        ;

        mvc.perform(get("/api/test?path=other_dir"))
                .andExpect(status().isNotFound())
        ;
    }

    @Test
    public void runTest() throws Exception {
    }

    @Test
    public void getResults() throws Exception {
    }

    @Test
    public void putTest() throws Exception {
        SakuliTestSuite testSuite = new SakuliTestSuite();
        testSuite.setRoot("project");
        testSuite.setName("project");
        testSuite.setTestSuiteFile("project/testsuite.suite");
        testSuite.setConfigurationFile("project/testsuite.properties");
        testSuite.setTestCases(Arrays.asList(
                buildTestCase("case1", "test.js", "http://sakuli.org", true, ""),
                buildTestCase("case2", "test.js", "http://sakuli.org", false, ""),
                buildTestCase("case3", "test.js", "http://sakuli.org", true, "")
        ));
        mvc.perform(
                put("/api/testsuite")
                .content(asJsonString(testSuite))
                .contentType(MediaType.APPLICATION_JSON)
        )
                .andExpect(status().isOk());

        mvc.perform(get("/api/testsuite?path=project"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.testCases", hasSize(3)))
        ;



        int dirCount = Paths.get(rootDirectory, "project").toFile().list().length;
        assertEquals(7, dirCount);
    }

    private SakuliTestCase buildTestCase(
            String name,
            String mainFile,
            String startUrl,
            boolean active,
            String comment
    ) {
        SakuliTestCase testCase = new SakuliTestCase();
        testCase.setName(name);
        testCase.setMainFile(mainFile);
        testCase.setStartUrl(startUrl);
        testCase.setActive(active);
        testCase.setComment(comment);
        return testCase;
    }

}