package com.Prototype.StyloSphere.classes.LogHistory;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import java.util.Date;
@Entity
@Table(name = "LogHistory")
public class LogInstance {
    @EmbeddedId
    private LogId userId;

    private Date timeStamp;
    private String Device;
    private String Browser;


    public LogInstance(Long userId, String Device, String Browser) {
        this.userId = new LogId(userId);
        this.timeStamp = new java.util.Date();
        this.Device = Device;
        this.Browser = Browser;
    }

    public LogInstance(){
    }

    public Long getUserId() {
        return this.userId.getUserId();
    }
    public Date getTimeStamp() {
        return this.timeStamp;
    }
    public String getDevice() {
        return this.Device;
    }
    public String getBrowser() {
        return this.Browser;
    }
}
