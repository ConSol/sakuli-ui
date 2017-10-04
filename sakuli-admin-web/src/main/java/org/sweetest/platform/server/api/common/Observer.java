package org.sweetest.platform.server.api.common;

public interface Observer<T> {
    void update(T v);
}
