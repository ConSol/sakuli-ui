package org.sweetest.platform.server.web;

import org.apache.commons.io.FileUtils;
import org.jooq.lambda.Unchecked;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.sweetest.platform.server.api.file.FileSystemService;
import org.sweetest.platform.server.api.project.ProjectService;
import org.sweetest.platform.server.api.test.*;
import org.sweetest.platform.server.api.test.result.BaseResult;
import org.sweetest.platform.server.api.test.result.TestSuiteResult;
import org.sweetest.platform.server.common.SakuliTestResultLogReader;
import org.testng.annotations.Test;

import java.io.File;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.function.Function;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Stream;

/**
 * Created by timkeiner on 19.07.17.
 */
@Controller
@RequestMapping("api/test")
public class TestController {

    private static final Logger log = LoggerFactory.getLogger(TestController.class);

    @Autowired
    private TestService testService;

    @Autowired
    private ProjectService projectService;

    @Autowired
    private FileSystemService fileSystemService;

    @RequestMapping(value = "{test}", method = RequestMethod.GET)
    @ResponseBody
    public Test getTest(@PathVariable("test") String test) {
        return null;
    }

    @RequestMapping(value = "", method = RequestMethod.GET)
    @ResponseBody
    public TestSuite getTestSuite() {
        return testService.getTestSuite();
    }

    @RequestMapping(value = "run", method = RequestMethod.POST)
    @ResponseBody
    public TestRunInfo runTest(@RequestBody TestSuite testSuite) {
        return this.testService.run(testSuite);
    }


    @GetMapping(value = "results")
    @ResponseBody
    public List<TestSuiteResult> getResults() {
        String sakuliPath = projectService.getActiveProject().getPath();
        return testService.getTestSuiteResults(sakuliPath);
    }

}
