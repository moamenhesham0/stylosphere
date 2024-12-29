package com.Prototype.StyloSphere.classes;

import jakarta.persistence.*;

import java.time.LocalDateTime;
@Entity
@Table(name = "complain")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "type", discriminatorType = DiscriminatorType.STRING)
public class Complain {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String complain;
    private String senderEmail;
    private LocalDateTime timeStamp;

    public Complain(String complain, String name, String senderEmail) {
        this.complain = complain;
        this.name = name;
        this.senderEmail = senderEmail;
        this.timeStamp = LocalDateTime.now();
    }

    public Complain() {
    }

    public String getType() {
        return this.getClass().getSimpleName();
    }

    public LocalDateTime getTimeStamp() {
        return this.timeStamp;
    }

    public void setTimeStamp(LocalDateTime timeStamp) {
        this.timeStamp = timeStamp;
    }

    public String getComplain() {
        return this.complain;
    }

    public void setComplain(String complain) {
        this.complain = complain;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSenderEmail() {
        return senderEmail;
    }

    public void setSenderEmail(String senderEmail) {
        this.senderEmail = senderEmail;
    }
}

