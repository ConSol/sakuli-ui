package org.sweetest.platform.server.api.test.execution.strategy;

public interface Subject<E> {
    void subscribe(Observer<E> observer);
    void removeObserver(Observer<E> observer);
    void next(E event);
}
