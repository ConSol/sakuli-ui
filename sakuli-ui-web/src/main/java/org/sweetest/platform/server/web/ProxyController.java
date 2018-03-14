package org.sweetest.platform.server.web;

import com.github.dockerjava.core.DockerClientConfig;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.client.RestTemplate;
import org.sweetest.platform.server.service.test.execution.TestExecutionInstancesService;

import javax.servlet.http.HttpServletRequest;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Enumeration;
import java.util.regex.Pattern;

@Controller
@RequestMapping(ProxyController.REQUEST_MAPPING_PATH)
public class ProxyController {


    final static String REQUEST_MAPPING_PATH = "/api/novnc";

    private RestTemplate restTemplate = new RestTemplate();

    @Autowired
    private TestExecutionInstancesService executionInstancesService;

    @Autowired
    private DockerClientConfig dockerClientConfig;

    @RequestMapping("{port}")
    @ResponseBody
    public String doProxyRoot(
            @RequestBody(required = false) String body,
            HttpMethod method,
            HttpServletRequest request,
            @PathVariable("port") String port
    ) throws URISyntaxException {
        return doProxy(body, method, request, port);
    }

    @RequestMapping("{port}/**/*")
    @ResponseBody
    public String doProxy(
            @RequestBody(required = false) String body,
            HttpMethod method,
            HttpServletRequest request,
            @PathVariable("port") String port
    ) throws URISyntaxException {

        URI dockerHost = dockerClientConfig.getDockerHost();

        String baseHref = String.format("%s/%s", REQUEST_MAPPING_PATH, port);
        URI uri = new URI(
                getScheme(dockerHost),
                null,
                getHost(dockerHost),
                Integer.parseInt(port),
                request.getRequestURI().replaceFirst(baseHref, ""),
                request.getQueryString(),
                null
        );

        MultiValueMap<String, String> headers = getHeaders(request);
        HttpEntity entity = body == null ? new HttpEntity<String>(headers) : new HttpEntity<>(body, headers);

        ResponseEntity<String> responseEntity = restTemplate.exchange(
                uri, method, entity, String.class
        );

        String responseEntityBody = responseEntity.getBody();
        return enrichHtmlIfNeeded(responseEntityBody, baseHref);
    }

    private String enrichHtmlIfNeeded(String responseEntityBody, String baseHref) {
        if(!baseHref.endsWith("/")) {
            baseHref = baseHref + "/";
        }
        final Pattern htmlPattern = Pattern.compile(".*<html.*>.*</html>.*", Pattern.DOTALL);
        boolean isHTML = htmlPattern.matcher(responseEntityBody).matches();
        if (isHTML) {
            Document doc = Jsoup.parse(responseEntityBody);
            Element base = doc.head().select("base").first();
            if (base != null) {
                base.attr("href", baseHref);
            } else {
                doc.head().prepend(String.format("<base href=\"%s\" />", baseHref));
            }
            return doc.html();
        } else {
            return responseEntityBody;
        }

    }

    private MultiValueMap<String, String> getHeaders(HttpServletRequest request) {
        Enumeration<String> headerNames = request.getHeaderNames();
        HttpHeaders httpHeaders = new HttpHeaders();
        while (headerNames.hasMoreElements()) {
            String headerName = headerNames.nextElement();
            httpHeaders.add(headerName, request.getHeader(headerName));
        }
        return httpHeaders;
    }

    private String getHost(URI dockerHost) {
        switch (dockerHost.getScheme()) {
            case "http":
            case "https":
            case "tcp":
                return dockerHost.getHost();
            case "unix":
                return "localhost";
            default:
                return "localhost";
        }
    }

    private String getScheme(URI dockerHost) {
        switch (dockerHost.getScheme()) {
            case "http":
            case "https":
                return dockerHost.getScheme();
            case "tcp":
            case "unix":
                return "http";
            default:
                return "http";
        }
    }

}
