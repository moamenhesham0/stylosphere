package com.Prototype.StyloSphere.classes.LogHistory;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.Date;

@Entity
@Table(name = "LogHistory")
public class LogInstance {
    @Id
    private Date timeStamp;
    
    private Long userId;
    private String Device;
    private String Browser;

    public LogInstance(Long userId, String Device, String Browser) {
        this.timeStamp = new Date(); // Current timestamp
        this.userId = userId;
        this.Device = Device;
        this.Browser = Browser;
    }

    public LogInstance(){
    }

    public Long getUserId() {
        return this.userId;
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
