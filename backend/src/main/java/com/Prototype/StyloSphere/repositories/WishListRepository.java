package com.Prototype.StyloSphere.repositories;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.Prototype.StyloSphere.classes.WishList.*;
import java.util.List;

@Repository
public interface WishListRepository extends JpaRepository<WishListItem, WishListId> { 
    @Query("SELECT w FROM WishListItem w WHERE w.id.customerId = :customerId")
    List<WishListItem> findByIdCustomerId(@Param("customerId") Long customerId); 
}
