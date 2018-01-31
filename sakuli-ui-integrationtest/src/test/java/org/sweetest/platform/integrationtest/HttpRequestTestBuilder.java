package org.sweetest.platform.integrationtest;

import com.consol.citrus.dsl.builder.HttpClientActionBuilder;
import com.consol.citrus.dsl.builder.HttpClientResponseActionBuilder;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;

import java.util.function.Consumer;
import java.util.function.Supplier;

public class HttpRequestTestBuilder {

    private HttpMethod method = HttpMethod.GET;
    private Supplier<HttpClientActionBuilder> actionBuilderSupplier;
    private String url;
    private HttpStatus status = HttpStatus.OK;
    private Consumer<JSONObject> jsonObjectValidator;
    private Consumer<JSONArray> jsonArrayValidator;

    public static HttpRequestTestBuilder from(Supplier<HttpClientActionBuilder> clientActionBuilderSupplier) {
        return new HttpRequestTestBuilder(clientActionBuilderSupplier);
    }

    private HttpRequestTestBuilder(Supplier<HttpClientActionBuilder> clientActionBuilderSupplier) {
        this.actionBuilderSupplier = clientActionBuilderSupplier;
    }

    public HttpRequestTestBuilder withMethod(HttpMethod method) {
        this.method = method;
        return this;
    }

    public HttpRequestTestBuilder withUrl(String url) {
        this.url = url;
        return this;
    }

    public HttpRequestTestBuilder expectStatus(HttpStatus status) {
        this.status = status;
        return this;
    }

    public HttpRequestTestBuilder validateJsonObject(Consumer<JSONObject> consumer) {
        if(null == this.jsonArrayValidator) {
            this.jsonObjectValidator = consumer;
        }
        return this;
    }

    public HttpRequestTestBuilder validateJsonArray(Consumer<JSONArray> consumer) {
        this.jsonArrayValidator = consumer;
        return this;
    }

    public HttpClientResponseActionBuilder run() {
        HttpClientActionBuilder requestAction = actionBuilderSupplier.get();
        switch (method) {
            case GET: {
                requestAction.send().get(url);
            }
            case PUT: {
                requestAction.send().put(url);
            }
            case DELETE: {
                requestAction.send().delete(url);
            }
            case HEAD: {
                requestAction.send().head(url);
            }
            case OPTIONS: {
                requestAction.send().options(url);
            }
            case PATCH: {
                requestAction.send().patch(url);
            }
            case POST: {
                requestAction.send().post(url);
            }
            case TRACE: {
                requestAction.send().trace(url);
            }
            default:
                requestAction.send().get(url);
        }

        HttpClientActionBuilder responseAction = actionBuilderSupplier.get();
        return responseAction
                .receive()
                .response(status)
                .validationCallback((r, h) -> {
                    if(null != jsonObjectValidator) {
                        jsonObjectValidator.accept(new JSONObject(r.getPayload().toString()));
                    }
                    if(null != jsonArrayValidator) {
                        jsonArrayValidator.accept(new JSONArray(r.getPayload().toString()));
                    }
                })
                ;
    }

}
