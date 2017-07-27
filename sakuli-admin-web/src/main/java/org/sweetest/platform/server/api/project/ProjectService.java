package org.sweetest.platform.server.api.project;

import java.util.Optional;

/**
 * Created by timkeiner on 19.07.17.
 */
public interface ProjectService {
    void setActiveProject(ProjectModel project);
    ProjectModel getActiveProject();

    boolean isValidProjectRoot(String path);

    Optional<ProjectModel> readProject(String path);

}
