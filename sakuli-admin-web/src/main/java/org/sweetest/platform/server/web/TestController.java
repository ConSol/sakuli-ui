package org.sweetest.platform.server.web;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.sweetest.platform.server.api.file.FileSystemService;
import org.sweetest.platform.server.api.project.ProjectService;
import org.sweetest.platform.server.api.runconfig.RunConfiguration;
import org.sweetest.platform.server.api.test.TestRunInfo;
import org.sweetest.platform.server.api.test.TestService;
import org.sweetest.platform.server.api.test.TestSuite;
import org.sweetest.platform.server.api.test.result.TestSuiteResult;
import org.sweetest.platform.server.service.sakuli.SakuliTestSuite;
import org.sweetest.platform.server.service.test.execution.TestExecutionStrategyFactory;
import sun.reflect.generics.reflectiveObjects.NotImplementedException;

import javax.ws.rs.QueryParam;
import java.util.List;

/**
 * Created by timkeiner on 19.07.17.
 */
@Controller
@RequestMapping("api/testsuite")
public class TestController {

    private static final Logger log = LoggerFactory.getLogger(TestController.class);

    @Autowired
    private TestService testService;

    @Autowired
    private ProjectService projectService;


    @Autowired
    private TestExecutionStrategyFactory strategyFactory;

    @RequestMapping(value = "{test}", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity getTest(
            @PathVariable("test") String test,
            @RequestParam("path") String path
    ) {
        throw new NotImplementedException();
    }

    @GetMapping()
    @ResponseBody
    public ResponseEntity<TestSuite> getTestSuite(
            @RequestParam("path") String path
    ) {
        return testService.getTestSuite(path)
                .map(ts -> ResponseEntity.ok().body(ts))
                .orElse(ResponseEntity.notFound().build());
    }

    @RequestMapping(value = "run", method = RequestMethod.POST)
    @ResponseBody
    public TestRunInfo runTest(@RequestBody TestSuite testSuite) {
        return this.testService.run(testSuite);
    }


    @GetMapping(value = "results")
    @ResponseBody
    public List<TestSuiteResult> getResults(
            @RequestParam("path") String path
    ) {
        return testService.getTestSuiteResults(path);
    }

    @PutMapping
    @ResponseBody
    public ResponseEntity putTest(
            @RequestBody SakuliTestSuite testSuite) {
        boolean success = projectService
                .readProject(testSuite.getRoot())
                .map(p -> testService.saveTestSuite(p, testSuite))
                .orElse(false);
        return success ? ResponseEntity.ok().build() : ResponseEntity.badRequest().build();
    }

}
