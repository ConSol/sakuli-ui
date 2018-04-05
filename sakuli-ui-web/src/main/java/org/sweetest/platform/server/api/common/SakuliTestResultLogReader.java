package org.sweetest.platform.server.api.common;

import org.apache.commons.io.FileUtils;
import org.jooq.lambda.Unchecked;
import org.sweetest.platform.server.api.test.result.BaseResult;
import org.sweetest.platform.server.api.test.result.TestCaseResult;
import org.sweetest.platform.server.api.test.result.TestCaseStepResult;
import org.sweetest.platform.server.api.test.result.TestSuiteResult;

import java.io.File;
import java.io.IOException;
import java.nio.charset.Charset;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.function.Function;
import java.util.regex.Matcher;
import java.util.stream.Stream;

public class SakuliTestResultLogReader {

    private final static int SUITE = 1;
    private final static int CASE = 2;
    private final static int STEP = 3;

    private final SimpleDateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
    private File logFile;
    private int recordType = 1;

    private final List<TestSuiteResult> resultList = new ArrayList<>();

    public SakuliTestResultLogReader(File logFile) {
        this.logFile = logFile;
    }

    private void setRecordType(int rf) {
        recordType = rf;
    }

    private int getRecordType() {
        return recordType;
    }

    private TestSuiteResult last(List<TestSuiteResult> list) {
        return list.get(list.size() - 1);
    }
    private BaseResult getBaseResultForRecordType() {
        if(getRecordType() == SUITE) {
            return last(resultList);
        }
        if(getRecordType() == CASE) {
            return last(resultList).latestTestCaseResult();
        }
        if(getRecordType() == STEP) {
            return last(resultList).latestTestCaseResult().latestStepResult();
        }
        return null;
    }

    public SakuliTestResultLogReader read() {
        getFileLinesAsStream(logFile)
                .forEach(l -> {
                    Function<Matcher, String> group1 = SwitchPattern.group(1);
                    SwitchPattern switchPattern = new SwitchPattern(l);

                    /**
                     * Recognize record Type
                     */

                    switchPattern.matches("=========== RESULT of SAKULI Testsuite \"(.*)\" - (.*) =================")
                            .map(group1)
                            .ifPresent(id -> {
                                resultList.add(new TestSuiteResult());
                                setRecordType(SUITE);
                            });
                    switchPattern.matches("======== test case \"(.*)\" ended with (.*) =================")
                            .ifPresent(s ->  {
                                last(resultList).getTestCaseResults().add(new TestCaseResult());
                                setRecordType(CASE);
                            });

                    switchPattern.matches("======== test case step \"(.*)\" ended with (.*) =================")
                            .ifPresent(s -> {
                                last(resultList).latestTestCaseResult().getSteps().add(new TestCaseStepResult());
                                setRecordType(STEP);
                            });

                    /**
                     * Setting Suite specific values
                     */

                    switchPattern.matches("test suite event: (.*)")
                            .map(group1)
                            .ifPresent(s -> last(resultList).setId(s));

                    switchPattern.matches("guid: (.*)")
                            .map(group1)
                            .ifPresent(s -> last(resultList).setGuid(s));

                    switchPattern.matches("browser: (.*)")
                            .map(group1)
                            .ifPresent(s -> last(resultList).setBrowserInfo(s));

                    /**
                     * Setting case specific values
                     */

                    switchPattern.matches("start URL: (.*)")
                            .map(group1)
                            .ifPresent(s -> last(resultList).latestTestCaseResult().setStartUrl(s));

                    switchPattern.matches("last URL: (.*)")
                            .map(group1)
                            .ifPresent(s -> last(resultList).latestTestCaseResult().setLastUrl(s));

                    /**
                     * Setting step specifc values
                     */

                    switchPattern.matches("ERROR - SCREENSHOT: (.*)")
                            .map(group1)
                            .ifPresent(s -> last(resultList).latestTestCaseResult().latestStepResult().setErrorScreenshot(s));

                    /**
                     * Setting common values
                     */

                    switchPattern.matches("name: (.*)")
                            .map(group1)
                            .ifPresent(s -> getBaseResultForRecordType().setName(s));

                    switchPattern.matches("RESULT STATE: (.*)")
                            .map(group1)
                            .ifPresent(s -> getBaseResultForRecordType().setState(s));

                    switchPattern.matches("result code: (.*)")
                            .map(group1)
                            .ifPresent(s -> getBaseResultForRecordType().setResultCode(s));

                    switchPattern.matches("db primary key: (.*)")
                            .map(group1)
                            .ifPresent(s -> getBaseResultForRecordType().setDbPrimaryKey(s));

                    switchPattern.matches("duration: (.*) sec.")
                            .map(group1)
                            .map(Float::parseFloat)
                            .ifPresent(s -> getBaseResultForRecordType().setDuration(s));

                    switchPattern.matches("warning time: (.*) sec.")
                            .map(group1)
                            .map(Float::parseFloat)
                            .ifPresent(s -> getBaseResultForRecordType().setWarningTime(s));

                    switchPattern.matches("critical time: (.*) sec.")
                            .map(group1)
                            .map(Float::parseFloat)
                            .ifPresent(s -> getBaseResultForRecordType().setCriticalTime(s));

                    switchPattern.matches("start time: (.*)")
                            .map(group1)
                            .map(Unchecked.function(s -> dateFormat.parse(s)))
                            .ifPresent(s -> getBaseResultForRecordType().setStartDate(s));

                    switchPattern.matches("end time: (.*)")
                            .map(group1)
                            .map(Unchecked.function(s -> dateFormat.parse(s)))
                            .ifPresent(s -> getBaseResultForRecordType().setStopDate(s));


                });

        return this;
    }

    public List<TestSuiteResult> getResultList() {
        return resultList;
    }

    private Stream<String> getFileLinesAsStream(File file) {
        try {
            return FileUtils.readLines(file, Charset.forName("UTF-8")).stream();
        } catch (IOException e) {
            return Stream.empty();
        }
    }

}
