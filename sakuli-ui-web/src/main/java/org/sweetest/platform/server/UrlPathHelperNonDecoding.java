package org.sweetest.platform.server;

import org.springframework.web.util.UrlPathHelper;

import javax.servlet.http.HttpServletRequest;

public class UrlPathHelperNonDecoding extends UrlPathHelper {

    public UrlPathHelperNonDecoding() {
        super.setUrlDecode(false);
    }

    @Override
    public void setUrlDecode(boolean urlDecode) {
        if (urlDecode) {
            throw new IllegalArgumentException("Handler does not support URL decoding.");
        }
    }

    @Override
    public String getServletPath(HttpServletRequest request) {
        String servletPath = getOriginatingServletPath(request);
        return servletPath;
    }


    @Override
    public String getOriginatingServletPath(HttpServletRequest request) {
        String servletPath = request.getRequestURI().substring(request.getContextPath().length());
        return servletPath;
    }
}

