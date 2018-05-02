package org.sweetest.platform.server.service.sakuli;

import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.sweetest.platform.server.api.file.FileSystemService;
import org.sweetest.platform.server.api.project.ProjectModel;
import org.sweetest.platform.server.api.project.ProjectService;
import org.sweetest.platform.server.api.test.TestService;

import javax.annotation.PostConstruct;
import java.io.File;
import java.util.Optional;

/**
 * Created by timkeiner on 19.07.17.
 */
@Service
public class SakuliProjectService implements ProjectService {

    private static final org.slf4j.Logger log = LoggerFactory.getLogger(SakuliTestService.class);

    static final String TESTSUITE_FILENAME = "testsuite.suite";
    static final String TESTPROPERTIES_FILENAME = "testsuite.properties";

    @Autowired
    private FileSystemService fileSystemService;

    @Autowired
    private TestService testService;

    private ProjectModel activeProject;

    @Override
    public void setActiveProject(ProjectModel activeProject) {
        this.activeProject = activeProject;
    }

    @Override
    public ProjectModel getActiveProject() {
        return activeProject;
    }

    @Override
    public boolean isValidProjectRoot(String path) {
        Optional<File> of = fileSystemService.getFileFromPath(path, TESTSUITE_FILENAME);
        return of.isPresent();
    }

    @Override
    public Optional<ProjectModel> readProject(String path) {
        if(isValidProjectRoot(path)) {
            ProjectModel project = new ProjectModel();
            project.setPath(path);
            project.setTestSuite(testService.getTestSuite(project));
            return Optional.of(project);
        }
        return Optional.empty();
    }


}
