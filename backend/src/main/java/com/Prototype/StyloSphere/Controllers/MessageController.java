package com.Prototype.StyloSphere.Controllers;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.Prototype.StyloSphere.services.CommentService;

import com.Prototype.StyloSphere.classes.Messages.*;


import java.util.*;
@RestController
@RequestMapping("/api/message")
@CrossOrigin(origins = "http://localhost:5173")
public class MessageController {


    
    @Autowired
    private CommentService commentService;


    @GetMapping("/comments")
    public ResponseEntity<List<Comment>> getProductComments(@RequestParam Long productId)
    {
        List<Comment> comments = commentService.getProductComments(productId);
        if(comments == null)
        {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(comments);
    }
    @GetMapping("/all-comments")
    public ResponseEntity<List<Comment>> getAllComments()
    {
        List<Comment> comments = commentService.getAllComments();
        if(comments == null)
        {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(comments);
    }
    @PostMapping("/add-comment")
    public ResponseEntity<Comment> addComment(@RequestParam Long productId, @RequestParam String message, @RequestParam Long sender) 
    {
        Comment comment = new Comment(productId, message, sender);
        try {
            Comment savedComment = commentService.save(comment);
            return ResponseEntity.ok(savedComment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/delete-comment")
    public ResponseEntity<String> deleteComment(@RequestParam Long id) {
        try {
            commentService.deleteComment(id);
            return ResponseEntity.ok("Comment deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to delete comment");
        }
    }
}
