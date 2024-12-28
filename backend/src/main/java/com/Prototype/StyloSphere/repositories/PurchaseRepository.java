package com.Prototype.StyloSphere.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.Prototype.StyloSphere.classes.Purchase;

import java.time.LocalDate;
import java.util.*;
@Repository
public interface PurchaseRepository extends JpaRepository<Purchase , Long> {
    List<Purchase> findByCustomerId(Long customerId);
    List<Purchase> findByTimeStamp(Date timeStamp);
    List<Purchase> findByProductId(Long productId);

    @Query("SELECT p.productId AS productId, SUM(p.quantity) AS totalSales FROM Purchase p GROUP BY p.productId ORDER BY totalSales DESC")
    List<Map<String, Object>> findBestSellers();

    @Query(value = "SELECT PRODUCT_ID, SUM(QUANTITY) as totalQuantity " +
                   "FROM PURCHASE_HISTORY " +
                   "GROUP BY PRODUCT_ID " +
                   "ORDER BY totalQuantity DESC", 
           nativeQuery = true)
    List<Object[]> findTopSellingProducts();


    @Query("SELECT FUNCTION('TO_CHAR', ph.timeStamp, :timePattern), SUM(ph.quantity) " +
       "FROM Purchase ph " +
       "WHERE ph.timeStamp BETWEEN :startDate AND :endDate " +
       "GROUP BY FUNCTION('TO_CHAR', ph.timeStamp, :timePattern)")
List<Object[]> findIncomeData(@Param("startDate") LocalDate startDate, 
                              @Param("endDate") LocalDate endDate, 
                              @Param("timePattern") String timePattern);


}
    

