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


    @Query("SELECT p FROM Purchase p WHERE p.customerId = :customerId AND TYPE(p) = Purchase")
    List<Purchase> findByCustomerId(Long customerId);

    @Query("SELECT p FROM Purchase p WHERE TYPE(p) = Purchase")
    List<Purchase> findAll();

    @Query("SELECT p FROM Purchase p WHERE p.timeStamp = :timeStamp AND TYPE(p) = Purchase")
    List<Purchase> findByTimeStamp(Date timeStamp);


    @Query("SELECT p FROM Purchase p WHERE p.productId = :productId AND TYPE(p) = Purchase")
    List<Purchase> findByProductId(Long productId);


    @Query(value = "SELECT PRODUCT_ID, SUM(QUANTITY) as totalQuantity " +
                   "FROM PURCHASE_HISTORY " +
                   "GROUP BY PRODUCT_ID " +
                   "ORDER BY totalQuantity DESC", 
           nativeQuery = true)
    List<Object[]> findTopSellingProducts();

    @Query(value = "SELECT p.productId AS productId, " +
       "pr.name AS productName, " +
       "SUM(p.quantity) AS totalSales " +
       "FROM Purchase p " +
       "JOIN Product pr ON p.productId = pr.id " +
       "GROUP BY p.productId, pr.name " +
       "ORDER BY totalSales DESC " +
       "LIMIT 3", 
       nativeQuery = true)
List<Map<String, Object>> findBestSellers();

    @Query("SELECT FUNCTION('TO_CHAR', ph.timeStamp, :timePattern), SUM(ph.quantity) " +
       "FROM Purchase ph " +
       "WHERE ph.timeStamp BETWEEN :startDate AND :endDate " +
       "GROUP BY FUNCTION('TO_CHAR', ph.timeStamp, :timePattern)")
List<Object[]> findIncomeData(@Param("startDate") LocalDate startDate, 
                              @Param("endDate") LocalDate endDate, 
                              @Param("timePattern") String timePattern);





@Query("SELECT YEAR(p.timeStamp) AS year, SUM(p.quantity) AS totalQuantity " +
       "FROM Purchase p " +
       "GROUP BY YEAR(p.timeStamp) " +
       "ORDER BY YEAR(p.timeStamp)")
List<Object[]> getYearlySales();

@Query("SELECT YEAR(p.timeStamp) AS year, MONTH(p.timeStamp) AS month, SUM(p.quantity) AS totalQuantity " +
       "FROM Purchase p " +
       "GROUP BY YEAR(p.timeStamp), MONTH(p.timeStamp) " +
       "ORDER BY YEAR(p.timeStamp), MONTH(p.timeStamp)")
List<Object[]> getMonthlySales();

@Query("SELECT DAY(p.timeStamp) AS day, SUM(p.quantity) AS totalQuantity " +
       "FROM Purchase p " +
       "WHERE YEAR(p.timeStamp) = YEAR(CURRENT_DATE) " +
       "AND MONTH(p.timeStamp) = MONTH(CURRENT_DATE) " +
       "GROUP BY DAY(p.timeStamp) " +
       "ORDER BY DAY(p.timeStamp)")
List<Object[]> getDailySales();

@Query("SELECT p FROM Purchase p WHERE TYPE(p) = Purchase ORDER BY p.timeStamp DESC")
List<Purchase> findAllOrdersByTimestampDesc();

                                                       


}


