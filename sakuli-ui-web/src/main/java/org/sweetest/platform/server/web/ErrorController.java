package org.sweetest.platform.server.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class ErrorController implements org.springframework.boot.autoconfigure.web.ErrorController {

    @GetMapping("/error")
    public ModelAndView redirectToIndex() {
        return new ModelAndView("forward:/");
        //return new ModelAndView("forward:/api/files/ls?path=");
    }

    @Override
    public String getErrorPath() {
        return "/error";
    }
}
