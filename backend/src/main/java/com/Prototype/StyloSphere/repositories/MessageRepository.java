package com.Prototype.StyloSphere.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.Prototype.StyloSphere.classes.Messages.Message;
import java.util.*;
public interface MessageRepository<T extends Message> extends JpaRepository<T , Long>{
    @Query("SELECT m FROM Message m WHERE m.senderId = :senderId")
    List<T> findBySenderId(@Param("senderId") Long senderId);

    @Query("SELECT m FROM Message m WHERE TYPE(m) = :type")
    List<T> findByType(@Param("type") String type);

    @Query("SELECT m FROM Message m WHERE m.productId = :productId")
    List<T> findByProductId(@Param("productId") Long productId);
}
