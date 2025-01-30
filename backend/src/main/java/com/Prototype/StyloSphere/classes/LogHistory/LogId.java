package com.Prototype.StyloSphere.classes.LogHistory;

import jakarta.persistence.Embeddable;

@Embeddable
public class LogId {
    private Long userId;
    
    public LogId(Long userId) {
        this.userId = userId;
    }
    public LogId(){
    }

    public Long getUserId() {
        return this.userId;
    }



}
