package org.sweetest.platform.server.service.test.execution.config;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit4.SpringRunner;
import org.sweetest.platform.server.api.file.FileSystemService;

@RunWith(SpringRunner.class)
public class SakuliRunConfigServiceTest {

    @MockBean
    private FileSystemService fileSystemService;

    @Autowired SakuliRunConfigService sakuliRunConfigService;

    @Test
    public void getRunConfigFromProject() {

    }

    @Test
    public void setRunConfigurationToProject() {
    }
}