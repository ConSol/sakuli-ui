package org.sweetest.platform.server.service.sakuli;

import org.apache.commons.io.FileUtils;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.sweetest.platform.server.api.file.FileSystemService;
import org.sweetest.platform.server.api.project.ProjectModel;

import java.io.File;
import java.nio.file.Paths;
import java.util.Optional;

import static org.junit.Assert.*;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyString;
import static org.mockito.Matchers.notNull;
import static org.mockito.Mockito.*;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest
public class SakuliTestServiceTest {

    @Autowired
    SakuliTestService sakuliTestService;

    @MockBean
    private FileSystemService fileSystemService;

    ProjectModel projectModel;

    @Before
    public void setup() {
        projectModel = new ProjectModel();
        projectModel.setPath(getClass().getResource("valid_project").getPath());
    }


    @Test
    public void getTestSuite() throws Exception {
        Optional<File> testSuiteFileOptional = Optional.of(Paths.get(projectModel.getPath(), SakuliProjectService.TESTSUITE_FILENAME).toFile());
        when(fileSystemService.getFileFromPath("",
                Paths.get(projectModel.getPath(),
                        SakuliProjectService.TESTSUITE_FILENAME).toString()
        ))

                .thenReturn(testSuiteFileOptional);

        when(fileSystemService.getFileFromPath(
                projectModel.getPath(),
                SakuliProjectService.TESTSUITE_FILENAME)
        )
                .thenReturn(testSuiteFileOptional);

        Optional<File> testPropertiesFileOptional = Optional.of(Paths.get(projectModel.getPath(), SakuliProjectService.TESTPROPERTIES_FILENAME).toFile());
        when(fileSystemService.getFileFromPath("",
                Paths.get(projectModel.getPath(),
                        SakuliProjectService.TESTPROPERTIES_FILENAME).toString()
        ))
                .thenReturn(testPropertiesFileOptional);

        when(fileSystemService.getFileLines(Paths.get(projectModel.getPath(),
                SakuliProjectService.TESTSUITE_FILENAME).toString())
        )
                .thenReturn(Optional.of(FileUtils.readLines(testSuiteFileOptional.get()).stream()));

        SakuliTestSuite testSuite = (SakuliTestSuite) sakuliTestService.getTestSuite(projectModel);
        assertEquals(2, testSuite.getConfigurationFiles().size());
        assertEquals(2, testSuite.getTestCases().size());
        assertFalse(testSuite.getTestCases().get(0).isActive());
        assertTrue(testSuite.getTestCases().get(1).isActive());

    }

    @Test
    public void saveTestSuite() throws Exception {


        SakuliTestSuite testSuite = new SakuliTestSuite();
        testSuite.setRoot("somewhere/in/files");
        SakuliTestCase testCase1 = new SakuliTestCase();
        SakuliTestCase testCase2 = new SakuliTestCase();

        testCase1.setComment("My comment");
        testCase1.setActive(false);
        testCase1.setName("case1");
        testCase1.setMainFile("test.js");
        testCase1.setStartUrl("http://www.sakuli.org");
        testSuite.getTestCases().add(testCase1);

        testCase2.setComment("My comment\n\non the second tc");
        testCase2.setActive(true);
        testCase2.setName("case2");
        testCase2.setMainFile("test.js");
        testCase2.setStartUrl("http://www.sakuli.org");
        testSuite.getTestCases().add(testCase2);

        when(fileSystemService.getFileFromPath(Paths.get(testSuite.getRoot(),"case1").toString(), "test.js"))
                .thenReturn(Optional.of(Paths.get(projectModel.getPath(), "dummy.js").toFile()));

        when(fileSystemService.getFileFromPath(Paths.get(testSuite.getRoot(),"case2").toString(), "test.js"))
                .thenReturn(Optional.empty());

        String fc = (
                "// My comment\n" +
                "// case1/test.js http://www.sakuli.org\n" +
                "// My comment\n" +
                "//\n" +
                "// on the second tc\n" +
                "case2/test.js http://www.sakuli.org\n"
        );

        when(fileSystemService.writeFile(anyString(), any(byte[].class))).thenReturn(true);

        when(fileSystemService.writeFile(
                "somewhere/in/files/testsuite.suite",
                fc.getBytes()
        )).thenReturn(true);

        boolean success = sakuliTestService.saveTestSuite(projectModel, testSuite);
        assertTrue(success);

        verify(fileSystemService).writeFile(
                Paths.get(testSuite.getRoot(),"case2/test.js").toString(),
                "".getBytes()
        );

        verify(fileSystemService, atLeast(2)).writeFile(anyString(), (byte[]) notNull());

    }

}