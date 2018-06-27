package org.sweetest.platform.server.web;

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

    @Autowired private String resolvedDockerHost;
    @Autowired private String resolvedDockerSchema;

    @RequestMapping("/{gateway}/{port}")
    @ResponseBody
    public ResponseEntity<String> doProxyRoot(
            @RequestBody(required = false) String body,
            HttpMethod method,
            HttpServletRequest request,
            @PathVariable("port") String port,
            @PathVariable("gateway") String gateway
    ) throws URISyntaxException {
        return doProxy(body, method, request, port, gateway);
    }

    @RequestMapping("/{gateway}/{port}/**/*")
    @ResponseBody
    public ResponseEntity<String> doProxy(
            @RequestBody(required = false) String body,
            HttpMethod method,
            HttpServletRequest request,
            @PathVariable("port") String port,
            @PathVariable("gateway") String gateway
    ) throws URISyntaxException {

        String baseHref = String.format("%s/%s/%s", REQUEST_MAPPING_PATH, gateway, port);
        URI uri = new URI(
                resolvedDockerSchema,
                null,
                gateway,
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
        final String enrichedHtml = enrichHtmlIfNeeded(responseEntityBody, baseHref);
        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.putAll(responseEntity.getHeaders());
        responseHeaders.setContentLength(enrichedHtml.getBytes().length);
        return new ResponseEntity<>(
                enrichedHtml,
                responseHeaders,
                responseEntity.getStatusCode()
        );
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


}
