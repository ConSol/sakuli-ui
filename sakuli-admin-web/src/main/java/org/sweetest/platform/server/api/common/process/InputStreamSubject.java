package org.sweetest.platform.server.api.common.process;

import org.jooq.lambda.Unchecked;
import org.sweetest.platform.server.api.common.Observer;
import org.sweetest.platform.server.api.common.Subject;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

public class InputStreamSubject implements Subject<String> {

    private List<Observer<String>> observers = new ArrayList<>();

    private InputStream inputStream;

    InputStreamSubject(InputStream inputStream) {
        this.inputStream = inputStream;
        InputStreamReader inputStreamReader = new InputStreamReader(inputStream);
        BufferedReader bufferedReader = new BufferedReader(inputStreamReader);
        new Thread(Unchecked.runnable(() -> {
            String line;
            while ((line = bufferedReader.readLine()) != null) {
                next(line);
            }
        })).start();
    }



    @Override
    public void subscribe(Observer<String> observer) {
        this.observers.add(observer);
    }

    @Override
    public void removeObserver(Observer<String> observer) {
        this.observers.remove(observer);
    }

    @Override
    public void next(String event) {
        this.observers.forEach(o -> o.update(event));
    }


}
