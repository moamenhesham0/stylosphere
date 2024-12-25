package com.Prototype.StyloSphere.repositories;

import com.Prototype.StyloSphere.classes.Messages.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository<T extends Message> extends JpaRepository<T, Long> {

    // Retrieve messages by senderId
    List<T> findBySenderId(Long senderId);

    List<Comment> findByProductId(Long productId);
}


