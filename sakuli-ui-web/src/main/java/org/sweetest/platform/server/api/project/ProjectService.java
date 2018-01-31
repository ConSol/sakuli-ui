package org.sweetest.platform.server.api.project;

import java.util.Optional;

/**
 * Created by timkeiner on 19.07.17.
 */
@Deprecated
public interface ProjectService {

    @Deprecated
    void setActiveProject(ProjectModel project);

    @Deprecated
    ProjectModel getActiveProject();

    boolean isValidProjectRoot(String path);

    Optional<ProjectModel> readProject(String path);

}
