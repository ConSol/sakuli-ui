package org.sweetest.platform.server;

import org.springframework.boot.autoconfigure.web.ErrorViewResolver;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
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



    private static final int CACHE_PERIOD_ONE_YEAR = 31536000;

    private static final int CACHE_PERIOD_NO_CACHE = 0;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        /*
        registry.setOrder(-1);
        registry.addResourceHandler("/styles.css").addResourceLocations("/styles.css").setCachePeriod(CACHE_PERIOD_ONE_YEAR);
        registry.addResourceHandler("/app/**").addResourceLocations("/app/").setCachePeriod(CACHE_PERIOD_NO_CACHE);
        registry.addResourceHandler("/").addResourceLocations("/index.html").setCachePeriod(CACHE_PERIOD_NO_CACHE);
        */
    }

    @Bean
    public ErrorViewResolver supportPathBasedLocationStrategyWithoutHashes() {
        return (HttpServletRequest req, HttpStatus status, Map<String, Object> model) -> status == HttpStatus.NOT_FOUND
                ? new ModelAndView("index.html", Collections.emptyMap(), HttpStatus.OK)
                : null;
    }


    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        //registry.addRedirectViewController("/**", "/index.html");
    }

    /*
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(getProjectSetupInterceptor());
    }

    */

}