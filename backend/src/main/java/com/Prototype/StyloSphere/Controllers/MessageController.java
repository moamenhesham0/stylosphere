package com.Prototype.StyloSphere.Controllers;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.Prototype.StyloSphere.services.MessageService;
import com.Prototype.StyloSphere.services.CommentService;
import com.Prototype.StyloSphere.classes.Messages.*;
import java.util.*;
@RestController
@RequestMapping("/api/message")
@CrossOrigin(origins = "http://localhost:5173")
public class MessageController {

    @Autowired
    private MessageService messageService;

    @Autowired
    private CommentService commentService;


    @PostMapping("/get-product-comments")
    public ResponseEntity<List<Comment>> getProductComments(@RequestParam Long productId)
    {
        return ResponseEntity.ok(commentService.getProductComments(productId));
    }

    
}
