package org.sweetest.platform.server.web;

import org.apache.commons.io.FileUtils;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.sweetest.platform.server.api.project.ProjectModel;
import org.sweetest.platform.server.api.project.ProjectService;

import java.io.File;
import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.file.Paths;
import java.util.Optional;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.hasSize;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@Ignore
public class FileControllerTest extends AbstractControllerTestWithFileSystem {

    @MockBean
    private ProjectService projectService;

    private ProjectModel dummyProject = new ProjectModel();

    @Before
    public void setup() throws IOException {
        dummyProject.setPath("");
        when(projectService.getActiveProject()).thenReturn(dummyProject);
        when(projectService.readProject(dummyProject.getPath())).thenReturn(Optional.of(dummyProject));
    }

    @Test
    public void getFiles() throws Exception {
        mvc.perform(get("/api/files/ls?path=testSuite")
            .contentType(MediaType.APPLICATION_JSON)
        )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(4)));

        mvc.perform(get("/api/files/ls?path=testSuite/case1")
                .contentType(MediaType.APPLICATION_JSON)
        )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(3)));
    }

    @Test
    public void getFilesWithFilter() throws Exception {
        mvc.perform(get("/api/files/ls?path=testSuite/case1/centos&filter=(.*.jpg|.*.md)")
                .contentType(MediaType.APPLICATION_JSON)
        )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)));

    }

    @Test
    public void readFile() throws Exception {
        mvc.perform(get("/api/files?path=testSuite/case1/README.md"))
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("Hello World")));
    }

    @Test
    public void writeFile() throws Exception {
        File expectedFile = Paths.get(
                rootDirectory, "testSuite/case1", "new_file.txt")
        .toFile();
        assertFalse(expectedFile.exists());
        MockMultipartFile multipartFile = new MockMultipartFile(
                "file",
                "test.txt",
                "text/plain",
                "I'm the new one".getBytes()
        );
        mvc.perform(
                fileUpload("/api/files?path=testSuite/case1/new_file.txt")
                .file(multipartFile)
                .contentType(MediaType.MULTIPART_FORM_DATA)
        )
                .andExpect(status().isOk());

        assertTrue(expectedFile.exists());
    }

    @Test
    public void deleteFile() throws Exception {
        File fileToDelete = Paths.get(rootDirectory, "file_to_delete.txt").toFile();
        FileUtils.write(fileToDelete, "Some useless data", Charset.forName("UTF-8"));
        assertTrue(fileToDelete.exists());
        mvc.perform(delete("/api/files?path=file_to_delete.txt"))
                .andExpect(status().isOk());
        assertFalse(fileToDelete.exists());

    }

}