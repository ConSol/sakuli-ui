package org.sweetest.platform.server.api.runconfig.dockerhub;

import java.util.List;

public class DockerHubResponse<R> {
    private Long count;
    private String next;
    private String previous;
    private List<R> results;

    public Long getCount() {
        return count;
    }

    public void setCount(Long count) {
        this.count = count;
    }

    public String getNext() {
        return next;
    }

    public void setNext(String next) {
        this.next = next;
    }

    public String getPrevious() {
        return previous;
    }

    public void setPrevious(String previous) {
        this.previous = previous;
    }

    public List<R> getResults() {
        return results;
    }

    public void setResults(List<R> results) {
        this.results = results;
    }
}
