package com.Prototype.StyloSphere.services;

import com.Prototype.StyloSphere.repositories.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.Prototype.StyloSphere. classes.Messages.*;
import java.util.List;


@Service
public class MessageService {

    @Autowired
    private MessageRepository<Message> messageRepository;

    public List<Message> getAllMessages()
    {
        return messageRepository.findAll();
    }
    public List<Message> getMessagesBySenderId(Long senderId)
    {
        return messageRepository.findBySenderId(senderId);
    }
    public void deleteMessage(Long messageId)
    {
        messageRepository.deleteById(messageId);
    }
    
}
