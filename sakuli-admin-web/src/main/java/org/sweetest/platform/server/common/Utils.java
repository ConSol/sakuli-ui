package org.sweetest.platform.server.common;

import java.util.function.Function;

/**
 * Created by timkeiner on 19.07.17.
 */
public class Utils {

    public static <R,T> Function<T,R> uncheck(Function<T, R> f) {
        return v -> {
            try {
                return f.apply(v);
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        };
    }

}
