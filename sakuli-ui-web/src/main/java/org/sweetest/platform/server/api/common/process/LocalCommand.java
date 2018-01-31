package org.sweetest.platform.server.api.common.process;

import org.sweetest.platform.server.api.common.Observer;

import java.io.IOException;

public class LocalCommand implements Command {

    private ProcessBuilder processBuilder;

    public LocalCommand(ProcessBuilder builder) {
        this.processBuilder = builder;
    }

    @Override
    public Process execute(Observer<String> output, Observer<String> error) {
        try {
            Process process = processBuilder.start();
            InputStreamSubject outputSubject = new InputStreamSubject(process.getInputStream());
            InputStreamSubject errorSubject = new InputStreamSubject(process.getErrorStream());
            outputSubject.subscribe(output);
            errorSubject.subscribe(error);
            return process;
        } catch (IOException e) {
            e.printStackTrace();
        }
        throw new RuntimeException("TODO: Better error-handling");
    }
}
