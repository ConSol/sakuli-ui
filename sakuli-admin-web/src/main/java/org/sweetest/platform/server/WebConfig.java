package org.sweetest.platform.server;

import org.springframework.boot.autoconfigure.web.ErrorViewResolver;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Collections;
import java.util.Map;

/**
 * Created by timkeiner on 19.07.17.
 */
@Configuration
public class WebConfig extends WebMvcConfigurerAdapter {

/*
    @Bean
    public ErrorViewResolver supportPathBasedLocationStrategyWithoutHashes() {
        return (HttpServletRequest req, HttpStatus status, Map<String, Object> model) -> status == HttpStatus.NOT_FOUND
                ? new ModelAndView("classpath:/index.html", Collections.emptyMap(), HttpStatus.OK)
                : null;
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        /*
        registry.setOrder(-1);
        registry.addResourceHandler("/styles.css").addResourceLocations("/styles.css").setCachePeriod(CACHE_PERIOD_ONE_YEAR);
        registry.addResourceHandler("/app/**").addResourceLocations("/app/").setCachePeriod(CACHE_PERIOD_NO_CACHE);
        registry.addResourceHandler("/").addResourceLocations("/index.html").setCachePeriod(CACHE_PERIOD_NO_CACHE);
        registry.addResourceHandler("/**").addResourceLocations("/", "classpath:/");
    }
        */

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new Interceptor());
    }

    class Interceptor extends HandlerInterceptorAdapter {
        @Override
        public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
            return true;
        }
    }
}