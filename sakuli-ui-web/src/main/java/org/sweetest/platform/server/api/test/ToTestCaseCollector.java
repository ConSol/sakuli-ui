package org.sweetest.platform.server.api.test;

import org.sweetest.platform.server.service.sakuli.SakuliTestCase;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.function.BiConsumer;
import java.util.function.BinaryOperator;
import java.util.function.Function;
import java.util.function.Supplier;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collector;
import java.util.stream.Collectors;

public class ToTestCaseCollector implements Collector<String, List<SakuliTestCase>, List<SakuliTestCase>> {

    private static String isUrlPatternString = "(https?:\\/\\/(?:www\\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\\.[^\\s]{2,}|www\\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\\.[^\\s]{2,}|https?:\\/\\/(?:www\\.|(?!www))[a-zA-Z0-9]\\.[^\\s]{2,}|www\\.[a-zA-Z0-9]\\.[^\\s]{2,})";
    private static String isSakuliTestCasePatternString = "[a-zA-Z0-9_\\-+]+\\/[a-zA-Z0-9_\\-+\\.]+\\.[a-zA-Z]+";

    public static Pattern isUrl = Pattern.compile(String.format("%s", isUrlPatternString));
    public static Pattern isSakuliTestCase = Pattern.compile(String.format("%s", isSakuliTestCasePatternString));

    public static Pattern isSakulitestCaseDefinition = Pattern.compile(
            String.format("(%s) (%s)", isSakuliTestCase, isUrl)
    );

    private SakuliTestCase currentCase = new SakuliTestCase();

    @Override
    public Supplier<List<SakuliTestCase>> supplier() {
        return ArrayList::new;
    }

    @Override
    public BiConsumer<List<SakuliTestCase>, String> accumulator() {
        return (list, line) -> {
            Matcher testDefinitionMatcher = isSakulitestCaseDefinition.matcher(line);
            if (testDefinitionMatcher.find() && testDefinitionMatcher.groupCount() == 3) {
                String[] nameParts = testDefinitionMatcher.group(1).split("/");
                currentCase.setName(nameParts[0]);
                currentCase.setMainFile(nameParts[1]);
                currentCase.setStartUrl(testDefinitionMatcher.group(2));
                currentCase.setActive(!line.trim().startsWith("//"));
                list.add(currentCase);
                currentCase = new SakuliTestCase();
            } else if (line.trim().startsWith("//")) {
                currentCase.setComment(new StringBuilder(currentCase.getComment())
                        .append("\n")
                        .append(line.replace("//", "").trim())
                        .toString()
                        .trim()
                );
            } else if(line.trim().isEmpty()) {
                currentCase.setComment("");
            }
        };
    }

    private SakuliTestCase getLastOf(List<SakuliTestCase> list) {
        if (list.isEmpty()) {
            list.add(new SakuliTestCase());
        }
        return list.get(list.size() - 1);
    }

    @Override
    public BinaryOperator<List<SakuliTestCase>> combiner() {
        return this::addAll;
    }

    private List<SakuliTestCase> addAll(List<SakuliTestCase> left, List<SakuliTestCase> right) {
        left.addAll(right);
        return left;
    }

    @Override
    public Function<List<SakuliTestCase>, List<SakuliTestCase>> finisher() {
        return x -> x.stream().filter(tc -> tc.getName() != null).collect(Collectors.toList());
    }

    @Override
    public Set<Characteristics> characteristics() {
        return new HashSet<>();
    }

    public static ToTestCaseCollector toTestCases() {
        return new ToTestCaseCollector();
    }


}
