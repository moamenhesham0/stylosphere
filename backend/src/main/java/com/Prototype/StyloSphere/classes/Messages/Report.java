package com.Prototype.StyloSphere.classes.Messages;


import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import java.util.Date;
@Entity
@DiscriminatorValue("Report")
public class Report extends Message {
    private String ReportedSubject;
    private String ReportedObject;

    public Report(String ReportedSubject ,String ReportedObject , String message , String sender , Date timeStamp) {
        super(message, sender);
        this.ReportedSubject = ReportedSubject;
        this.ReportedObject = ReportedObject;
    }

    public String getReportedSubject() {
        return ReportedSubject;
    }
    public void setReportedSubject(String ReportedSubject) {
        this.ReportedSubject = ReportedSubject;
    }

    public String getReportedObject() {
        return ReportedObject;
    }
    public void setReportedObject(String ReportedObject) {
        this.ReportedObject = ReportedObject;
    }
}
