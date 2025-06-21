package stylosphere.repositories;

// Import from stylosphere packages
import stylosphere.models.order.Order;
import stylosphere.models.order.Order.OrderStatus;

// Import from Spring Data JPA
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

// Import from standard Java packages
import java.util.List;
import java.util.Date;
import java.util.Map;
import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long>
{
    @Query(value = "SELECT PRODUCT_ID, SUM(QUANTITY) as totalQuantity " +
                   "FROM \"order\" " +
                   "WHERE STATUS IN ('PENDING', 'DELIVERED') " +
                   "GROUP BY PRODUCT_ID " +
                   "ORDER BY totalQuantity DESC",
            nativeQuery = true)
    List<Object[]> findTopSellingProducts();

    @Query(value = "SELECT o.product_id AS productId, " +
                   "p.name AS productName, " +
                   "SUM(o.quantity) AS totalSales " +
                   "FROM \"order\" o " +
                   "JOIN product p ON o.product_id = p.id " +
                   "WHERE o.status IN ('PENDING', 'DELIVERED') " +
                   "GROUP BY o.product_id, p.name " +
                   "ORDER BY totalSales DESC " +
                   "LIMIT 3",
            nativeQuery = true)
    List<Map<String, Object>> findBestSellers();

    @Query(value = "SELECT TO_CHAR(o.purchase_date, :timePattern), SUM(o.quantity) " +
                   "FROM \"order\" o " +
                   "WHERE o.purchase_date BETWEEN :startDate AND :endDate " +
                   "AND o.status IN ('PENDING', 'DELIVERED') " +
                   "GROUP BY TO_CHAR(o.purchase_date, :timePattern)",
            nativeQuery = true)
    List<Object[]> findIncomeData(@Param("startDate") Date startDate,
                                 @Param("endDate") Date endDate,
                                 @Param("timePattern") String timePattern);

    @Query(value = "SELECT EXTRACT(YEAR FROM o.purchase_date) AS year, SUM(o.quantity) AS totalQuantity " +
                   "FROM \"order\" o " +
                   "WHERE o.status IN ('PENDING', 'DELIVERED') " +
                   "GROUP BY EXTRACT(YEAR FROM o.purchase_date) " +
                   "ORDER BY EXTRACT(YEAR FROM o.purchase_date)",
            nativeQuery = true)
    List<Object[]> getYearlySales();

    @Query(value = "SELECT EXTRACT(YEAR FROM o.purchase_date) AS year, " +
                   "EXTRACT(MONTH FROM o.purchase_date) AS month, " +
                   "SUM(o.quantity) AS totalQuantity " +
                   "FROM \"order\" o " +
                   "WHERE o.status IN ('PENDING', 'DELIVERED') " +
                   "GROUP BY EXTRACT(YEAR FROM o.purchase_date), EXTRACT(MONTH FROM o.purchase_date) " +
                   "ORDER BY EXTRACT(YEAR FROM o.purchase_date), EXTRACT(MONTH FROM o.purchase_date)",
            nativeQuery = true)
    List<Object[]> getMonthlySales();

    @Query(value = "SELECT EXTRACT(DAY FROM o.purchase_date) AS day, SUM(o.quantity) AS totalQuantity " +
                   "FROM \"order\" o " +
                   "WHERE EXTRACT(YEAR FROM o.purchase_date) = EXTRACT(YEAR FROM CURRENT_DATE) " +
                   "AND EXTRACT(MONTH FROM o.purchase_date) = EXTRACT(MONTH FROM CURRENT_DATE) " +
                   "AND o.status IN ('PENDING', 'DELIVERED') " +
                   "GROUP BY EXTRACT(DAY FROM o.purchase_date) " +
                   "ORDER BY EXTRACT(DAY FROM o.purchase_date)",
            nativeQuery = true)
    List<Object[]> getDailySales();

    @Query("SELECT o FROM Order o WHERE o.status IN ('PENDING', 'DELIVERED') ORDER BY o.purchaseDate DESC")
    List<Order> findAllOrdersByPurchaseDateDesc();
}