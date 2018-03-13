package org.sweetest.platform.server.api.common;

import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.map.SerializationConfig;
import org.codehaus.jackson.schema.JsonSchema;
import org.sweetest.platform.server.api.runconfig.KeyValuePair;
import org.testng.annotations.Test;

import java.util.ArrayList;
import java.util.List;

import static org.testng.Assert.fail;

public class TempTest {



    public static class SomeThing {
        private String name;
        private List<KeyValuePair> strings = new ArrayList<>();

        public List<KeyValuePair> getStrings() {
            return strings;
        }

        public void setStrings(List<KeyValuePair> strings) {
            this.strings = strings;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }
    }

    @Test
    public void testIt() {
        ObjectMapper mapper = new ObjectMapper();
        mapper.configure(SerializationConfig.Feature.WRITE_ENUMS_USING_TO_STRING, true);
        try {
            JsonSchema schema = mapper.generateJsonSchema(SomeThing.class);
            System.out.println(schema.toString());
        } catch (JsonMappingException e) {
            fail(e.getMessage());
        }
    }
}