package com.Prototype.StyloSphere.classes.Messages;

import jakarta.persistence.*;

import java.time.LocalDateTime;
@Entity
@Table(name = "Messages")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "type", discriminatorType = DiscriminatorType.STRING)
public abstract class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String message;
    private String Sender;
    private LocalDateTime timeStamp;

    public Message(String message , String sender) {
        this.message = message;
        this.Sender = sender;
        this.timeStamp = LocalDateTime.now();
    }

    public LocalDateTime getTimeStamp() {
        return this.timeStamp;
    }
    public void setTimeStamp(LocalDateTime timeStamp) {
        this.timeStamp = timeStamp;
    }
    
    public Message(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public String getSender() {
        return Sender;
    }
    public void setSender(String sender) {
        Sender = sender;
    }
}
