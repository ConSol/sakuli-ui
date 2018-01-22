package org.sweetest.platform.server.api.common.process;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.sweetest.platform.server.api.common.Observer;
import org.sweetest.platform.server.api.common.Subject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

public class InputStreamSubject implements Subject<String> {

    private List<Observer<String>> observers = new ArrayList<>();

    private static final Logger log = LoggerFactory.getLogger(InputStreamSubject.class);

    private InputStream inputStream;

    InputStreamSubject(InputStream inputStream) {
        this.inputStream = inputStream;
        InputStreamReader inputStreamReader = new InputStreamReader(inputStream);
        BufferedReader bufferedReader = new BufferedReader(inputStreamReader);
        new Thread(() -> {
            String line;
            while ((line = readLine(bufferedReader)) != null) {
                next(line);
            }
        }).start();
    }

    private String readLine(BufferedReader bufferedReader) {
        try {
            return bufferedReader.readLine();
        } catch (IOException e) {
            log.warn("Buffered reader stopped", e);
            return null;
        }
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
