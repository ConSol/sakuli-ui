package org.sweetest.platform.server.api.common.process;

import org.sweetest.platform.server.api.common.Observer;

public interface Command {
    Process execute(Observer<String> out, Observer<String> error);
}
