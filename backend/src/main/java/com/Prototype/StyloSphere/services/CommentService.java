package com.Prototype.StyloSphere.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.Prototype.StyloSphere.repositories.*;
import com.Prototype.StyloSphere.classes.Messages.*;
import java.util.List;
@Service
public class CommentService {
    
    @Autowired
    private MessageRepository<Comment> commentRepository;


    public List<Comment> getAllComments()
    {
        return commentRepository.findAll();
    }
    public void save(Comment comment)
    {
        commentRepository.save(comment);
    }
    public List<Comment> getCommentsBySenderId(Long senderId)
    {
        return commentRepository.findBySenderId(senderId);
    }
    public List<Comment> getProductComments(Long productId) {
        try {
            return commentRepository.findByProductId(productId); // Assuming you have this in the repository
        } catch (Exception e) {
            // Log the error for debugging purposes
            throw new RuntimeException("Failed to fetch comments\n\n\n\n", e); // Handle appropriately
        }
    }
    
}
