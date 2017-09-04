package org.sweetest.platform.server.api.test.result;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Date;

public abstract class BaseResult {

    private String name;
    private String resultState;
    private String resultCode;
    private String dbPrimaryKey;
    private float duration;
    private float warningTime;
    private float criticalTime;
    private Date startTime;
    private Date endTime;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getResultState() {
        return resultState;
    }

    public void setResultState(String resultState) {
        this.resultState = resultState;
    }

    public String getResultCode() {
        return resultCode;
    }

    public void setResultCode(String resultCode) {
        this.resultCode = resultCode;
    }

    public String getDbPrimaryKey() {
        return dbPrimaryKey;
    }

    public void setDbPrimaryKey(String dbPrimaryKey) {
        this.dbPrimaryKey = dbPrimaryKey;
    }

    public float getDuration() {
        return duration;
    }

    public void setDuration(float duration) {
        this.duration = duration;
    }

    public float getWarningTime() {
        return warningTime;
    }

    public void setWarningTime(float warningTime) {
        this.warningTime = warningTime;
    }

    public float getCriticalTime() {
        return criticalTime;
    }

    public void setCriticalTime(float criticalTime) {
        this.criticalTime = criticalTime;
    }

    public Date getStartTime() {
        return startTime;
    }

    public void setStartTime(Date startTime) {
        this.startTime = startTime;
    }

    public Date getEndTime() {
        return endTime;
    }

    public void setEndTime(Date endTime) {
        this.endTime = endTime;
    }
}
