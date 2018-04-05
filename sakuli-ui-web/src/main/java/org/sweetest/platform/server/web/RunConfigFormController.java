package org.sweetest.platform.server.web;

import org.codehaus.jackson.annotate.JsonProperty;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("api/forms/runconfig")
public class RunConfigFormController extends AbstractFormController {

    class SakuliContainerForm {
        @JsonProperty
        String name;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }
    }

    @Override
    Class getType() {
        return SakuliContainerForm.class;
    }


}
