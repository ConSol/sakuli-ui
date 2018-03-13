package org.sweetest.platform.server.web;

import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.map.SerializationConfig;
import org.codehaus.jackson.schema.JsonSchema;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

public abstract class AbstractFormController<T> {

    @GetMapping(value = "schema", produces = "application/json")
    @ResponseBody
    public ResponseEntity<String> getSchema() {
        ObjectMapper mapper = new ObjectMapper();
        mapper.configure(SerializationConfig.Feature.WRITE_ENUMS_USING_TO_STRING, true);
        JsonSchema schema;
        try {
            schema = mapper.generateJsonSchema(getType());
            return ResponseEntity.ok(schema.toString());
        } catch (JsonMappingException e) {
            e.printStackTrace();
            return ResponseEntity.unprocessableEntity().build();
        }
    }

    abstract Class<T> getType();

}
