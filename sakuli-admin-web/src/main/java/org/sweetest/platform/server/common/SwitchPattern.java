package org.sweetest.platform.server.common;

import java.util.Optional;
import java.util.function.Function;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

class SwitchPattern {
    private String switchValue;

    public SwitchPattern(String switchValue) {
        this.switchValue = switchValue;
    }

    public Optional<Matcher> matches(String regExPattern) {
        Pattern pattern = Pattern.compile(regExPattern);
        Matcher matcher = pattern.matcher(switchValue);
        return matcher.find() ? Optional.of(matcher) : Optional.empty();
    }

    public static Function<Matcher, String> group(int i) {
        return m -> m.group(i);
    }
}
