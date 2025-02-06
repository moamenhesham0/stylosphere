package com.Prototype.StyloSphere.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import com.Prototype.StyloSphere.classes.Order;
import com.Prototype.StyloSphere.classes.Purchase;

import java.util.*;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    @Query("SELECT o FROM Order o WHERE o.productId = :productId AND TYPE(o) = Order")
    List<Order> findByProductId(Long productId);

    @Query("SELECT o FROM Order o WHERE o.customerId = :customerId AND TYPE(o) = Order")
    List<Order> findByCustomerId(Long CustomerId);


    @Modifying
    @Transactional
    @Query("DELETE FROM Order o WHERE o.customerId = :customerId AND TYPE(o) = Order")
    void deleteByCustomerId(@Param("customerId") Long customerId);

    @Query("SELECT o FROM Order o WHERE o.productId = :productId AND o.customerId = :customerId AND o.productColor = :productColor AND o.productSize = :productSize AND TYPE(o) = Order")
    Optional<Order> findByProductIdAndCustomerIdAndColorAndSize(
        @Param("productId") Long productId,
        @Param("customerId") Long customerId,
        @Param("productColor") String productColor,
        @Param("productSize") String productSize
    );
}
