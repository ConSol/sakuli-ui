package org.sweetest.platform.server.api.test.execution.strategy;

import org.sweetest.platform.server.api.common.Observer;
import org.sweetest.platform.server.api.common.Subject;

import java.util.ArrayList;
import java.util.List;

public class TestExecutionSubject implements Subject<TestExecutionEvent> {

    List<Observer<TestExecutionEvent>> observers = new ArrayList<>();

    @Override
    public void subscribe(Observer<TestExecutionEvent> observer) {
        observers.add(observer);
    }

    @Override
    public void removeObserver(Observer<TestExecutionEvent> observer) {
        observers.remove(observer);
    }

    @Override
    public void next(TestExecutionEvent event) {
        observers.stream().forEach(o -> o.update(event));
    }
}
