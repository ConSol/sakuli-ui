package org.sweetest.jsonform.schema;

import java.util.HashMap;
import java.util.Map;

public class ObjectField implements Field {

    private Map<StringField, Field> properties = new HashMap<>();

    @Override
    public String getType() {
        return "object";
    }

    public ObjectField addProperty(StringField key, Field value) {
        properties.put(key, value);
        return this;
    }

    public void setProperties(Map<StringField, Field> properties) {
        this.properties = properties;
    }

    public Map<StringField, Field> getProperties() {
        return properties;
    }
}
