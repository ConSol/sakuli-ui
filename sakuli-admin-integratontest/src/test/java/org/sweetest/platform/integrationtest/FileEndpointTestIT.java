package org.sweetest.platform.integrationtest;

import com.consol.citrus.annotations.CitrusTest;
import com.consol.citrus.dsl.testng.TestNGCitrusTestDesigner;
import com.consol.citrus.http.client.HttpClient;
import org.apache.commons.lang.builder.ReflectionToStringBuilder;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.testng.annotations.Test;

/**
 * Testing the Endpoint for files
 *
 * @author Tim Keiner
 * @since 2017-07-27
 */
@Test
public class FileEndpointTestIT extends TestNGCitrusTestDesigner {

    @Autowired
    private HttpClient sakuliAdminClient;

    @Test()
    @CitrusTest(name = "Test Connection")
    public void fileEndpointTestIT() {

        HttpRequestTestBuilder.from(() -> http().client(sakuliAdminClient))
                .withMethod(HttpMethod.GET)
                .withUrl("api/files/ls")
                .validateJsonArray(o -> {
                    System.out.println("In Test-----------------------------");
                    System.out.println(ReflectionToStringBuilder.toString(o));


                })
                .run();
    }
}
