package org.sweetest.platform.server;

import org.springframework.boot.autoconfigure.web.ErrorViewResolver;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import javax.servlet.http.HttpServletRequest;
import java.util.Collections;
import java.util.Map;

/**
 * Created by timkeiner on 19.07.17.
 */
@Configuration
public class WebConfig extends WebMvcConfigurerAdapter {

    @Bean
    public ErrorViewResolver supportPathBasedLocationStrategyWithoutHashes() {
        return (HttpServletRequest req, HttpStatus status, Map<String, Object> model) -> status == HttpStatus.NOT_FOUND
                ? new ModelAndView("index.html", Collections.emptyMap(), HttpStatus.OK)
                : null;
    }
/*
    @Bean
    public ProjectSetupInterceptor getProjectSetupInterceptor() {
        ProjectSetupInterceptor interceptor = new ProjectSetupInterceptor();
        interceptor.setRedirect("/setup");
        interceptor.setExcludes(new String[]{
                "/assets/*",
                "/api/*",
                "/templates/*",
                "/error"
        });
        return interceptor;
    }
*/
    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/setup").setViewName("forward:/index.html");
    }

    /*
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(getProjectSetupInterceptor());
    }
    */
}