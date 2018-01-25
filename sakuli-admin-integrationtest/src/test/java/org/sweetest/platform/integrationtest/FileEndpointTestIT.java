package org.sweetest.platform.integrationtest;

import com.consol.citrus.annotations.CitrusTest;
import com.consol.citrus.dsl.testng.TestNGCitrusTestDesigner;
import org.testng.annotations.Test;

/**
 * Testing the Endpoint for files
 *
 * @author Tim Keiner
 * @since 2017-07-27
 */
@Test
public class FileEndpointTestIT extends TestNGCitrusTestDesigner {

    @Test()
    @CitrusTest(name = "Test Connection")
    public void fileEndpointTestIT() {

    }
}
