package org.sweetest.platform.server.api.test.result;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.util.Date;

public abstract class BaseResult {

    private String name;
    private String state;
    private String resultCode;
    private String dbPrimaryKey;
    private float duration;
    private float warningTime;
    private float criticalTime;
    private Object execption;
    private String id;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSX")
    private Date startDate;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSX")
    private Date stopDate;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSX")
    private Date creationDate;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
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

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getStopDate() {
        return stopDate;
    }

    public void setStopDate(Date stopDate) {
        this.stopDate = stopDate;
    }

    public Object getExecption() {
        return execption;
    }

    public void setExecption(Object execption) {
        this.execption = execption;
    }

    public Date getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(Date creationDate) {
        this.creationDate = creationDate;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
}
