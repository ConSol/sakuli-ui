package org.sweetest.platform.server.api.test;

import org.junit.Ignore;
import org.junit.Test;
import org.sweetest.platform.server.service.sakuli.SakuliTestCase;

import java.util.Arrays;
import java.util.List;
import java.util.regex.Matcher;
import java.util.stream.Stream;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.sweetest.platform.server.api.test.ToTestCaseCollector.toTestCases;

public class ToTestCaseCollectorTest {

    private String inactiveTest = "// case1/test.js http://www.sakuli.org";
    private String activeTest = "case2/citrus.js http://www.citrusframework.org";

    Stream<String> lines = Arrays.asList(
            "This is a general comment, which is not attached to any tc",
            "",
            "// this is a comment",
            "// which explains an inactive test",
            inactiveTest,
            "",
            "// another comment for an active test",
            activeTest
    ).stream();

    @Test
    public void isSakulitestCaseDefinitionInactive() {
        Matcher inactiveMatcher  = ToTestCaseCollector.isSakulitestCaseDefinition.matcher(inactiveTest);

        assertTrue("Matches URL inactive", ToTestCaseCollector.isUrl.matcher(inactiveTest).find());
        assertTrue("Matches TcD inactive", ToTestCaseCollector.isSakuliTestCase.matcher(inactiveTest).find());
        assertTrue(inactiveMatcher.find());

        assertEquals(3, inactiveMatcher.groupCount());
        assertEquals("case1/test.js", inactiveMatcher.group(1));
        assertEquals("http://www.sakuli.org", inactiveMatcher.group(2));

    }

    @Test
    public void isSakulitestCaseDefinitionActive() {
        Matcher activeMatcher  = ToTestCaseCollector.isSakulitestCaseDefinition.matcher(activeTest);
        assertTrue("Matches URL active", ToTestCaseCollector.isUrl.matcher(activeTest).find());
        assertTrue("Matches TcD active", ToTestCaseCollector.isSakuliTestCase.matcher(activeTest).find());
        assertTrue(activeMatcher.find());

        assertEquals(3, activeMatcher.groupCount());
        assertEquals("case2/citrus.js", activeMatcher.group(1));
        assertEquals("http://www.citrusframework.org", activeMatcher.group(2));
    }

    @Test
    public void patternsMatchingWithSpecialCharsTest() {
        Arrays.asList(
                "case1/sakuli_demo.js http://www.sakuli.org",
                "_case1/sakuli_demo.js http://www.sakuli.org",
                "case1_/sakuli_demo.js http://www.sakuli.org",
                "case1/_sakuli_demo.js http://www.sakuli.org",
                "_case1_/sakulidemo.js http://www.sakuli.org"
        ).forEach(d -> {
            Matcher matcher = ToTestCaseCollector.isSakulitestCaseDefinition.matcher(d);
            assertTrue(matcher.find());
        });
    }

    @Test
    public void toTestCasesTest() throws Exception {
        List<SakuliTestCase> sakuliTestCases = lines
                .collect(toTestCases());

        assertEquals(2, sakuliTestCases.size());

        SakuliTestCase tc1 = sakuliTestCases.get(0);
        SakuliTestCase tc2 = sakuliTestCases.get(1);

        assertFalse(tc1.isActive());
        assertEquals("case1/test.js", tc1.getName());
        assertEquals("http://www.sakuli.org", tc1.getStartUrl());
        assertEquals("this is a comment\nwhich explains an inactive test", tc1.getComment());

        assertTrue(tc2.isActive());
        assertEquals("case2/citrus.js", tc2.getName());
        assertEquals("http://www.citrusframework.org", tc2.getStartUrl());
        assertEquals("another comment for an active test", tc2.getComment());

    }

}