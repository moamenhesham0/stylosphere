package com.Prototype.StyloSphere.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.Prototype.StyloSphere.repositories.MessageRepository;
import com.Prototype.StyloSphere.classes.Messages.*;
import java.util.List;
@Service
public class CommentService {
    @Autowired
    private MessageRepository<Comment> commentRepository;


    public List<Comment> getAllComments()
    {
        return commentRepository.findByType("Comment");
    }
    public List<Comment> getCommentsBySenderId(Long senderId)
    {
        return commentRepository.findBySenderId(senderId);
    }
    public List<Comment> getProductComments(Long productId)
    {
        return commentRepository.findByProductId(productId);
    }
}
