package com.Prototype.StyloSphere.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Prototype.StyloSphere.classes.Purchase;
import java.util.*;
@Repository
public interface PurchaseRepository extends JpaRepository<Purchase , Long> {
    List<Purchase> findByCustomerId(Long customerId);
    List<Purchase> findByTimeStamp(Date timeStamp);
    List<Purchase> findByProductId(Long productId);
}
    

