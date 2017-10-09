package org.sweetest.platform.server.api.common;

import org.sweetest.platform.server.api.test.result.TestSuiteResult;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import java.io.File;
import java.net.URI;
import java.util.List;

import static org.testng.Assert.*;

public class SakuliTestResultLogReaderTest {

    private File logFile;
    private SakuliTestResultLogReader logReader;

    @BeforeMethod
    public void setUp() throws Exception {
        URI uri = getClass().getResource("_sakuli.log").toURI();
        logFile = new File(uri);
        logReader = new SakuliTestResultLogReader(logFile);
    }

    @Test
    public void testRead() throws Exception {
        List<TestSuiteResult> results = logReader.read().getResultList();

        assertEquals(results.size(), 1, "Found one result");

        TestSuiteResult testSuiteResult = results.get(0);

        assertEquals(testSuiteResult.getTestCaseResults().size(), 1, "First Suite has one case");

        assertEquals(testSuiteResult.getTestCaseResults().get(0).getSteps().size(), 3, "3 steps");
    }

}