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

import java.nio.file.Paths;
import java.util.Optional;

import static org.junit.Assert.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

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
        when(fileSystemService.getFileFromPath("",
                Paths.get(projectModel.getPath(),
                        SakuliProjectService.TESTSUITE_FILENAME).toString()
        ))

                .thenReturn(Optional.of(Paths.get(projectModel.getPath(), SakuliProjectService.TESTSUITE_FILENAME).toFile()));

        when(fileSystemService.getFileFromPath("",
                Paths.get(projectModel.getPath(),
                        SakuliProjectService.TESTPROPERTIES_FILENAME).toString()
        ))
                .thenReturn(Optional.of(Paths.get(projectModel.getPath(), SakuliProjectService.TESTPROPERTIES_FILENAME).toFile()));

        when(fileSystemService.getFileLines(Paths.get(projectModel.getPath(),
                SakuliProjectService.TESTSUITE_FILENAME).toString())
        )
                .thenReturn(Optional.of(FileUtils.readLines(Paths.get(projectModel.getPath(),
                        SakuliProjectService.TESTSUITE_FILENAME).toFile()).stream()));

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
        testCase1.setName("case1/test.js");
        testCase1.setStartUrl("http://www.sakuli.org");
        testSuite.getTestCases().add(testCase1);

        testCase2.setComment("My comment\non the second tc");
        testCase2.setActive(true);
        testCase2.setName("case2/test.js");
        testCase2.setStartUrl("http://www.sakuli.org");
        testSuite.getTestCases().add(testCase2);

        sakuliTestService.saveTestSuite(projectModel, testSuite);

        String fc = (
                "// My comment\n" +
                        "// case1/test.js http://www.sakuli.org\n" +
                        "// My comment\n" +
                        "// on the second tc\n" +
                        "case2/test.js http://www.sakuli.org\n"
        );
        System.out.println("Expect:\n" + fc);
        verify(fileSystemService).writeFile(
                "somewhere/in/files/testsuite.suite",
                fc.getBytes()
        );
    }

}