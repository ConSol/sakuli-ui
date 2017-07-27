package org.sweetest.platform.server.web;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.sweetest.platform.server.api.test.TestCase;
import org.sweetest.platform.server.api.test.TestService;
import org.sweetest.platform.server.api.test.TestSuite;
import org.testng.annotations.Test;

/**
 * Created by timkeiner on 19.07.17.
 */
@Controller
@RequestMapping("api/test")
public class TestController {

    @Autowired
    private TestService testService;

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
    public String runTest(TestSuite testSuite) {
        this.testService.run(testSuite);
        return "";
    }

}
