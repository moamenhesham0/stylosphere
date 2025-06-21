package stylosphere.repositories;

// Import from stylosphere packages
import stylosphere.models.Product;

// Import from Spring Data JPA
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

// Import from standard Java packages
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>
{
        @Query(value = "SELECT * FROM PRODUCTS WHERE " +
        "LOWER(NAME) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
        "LOWER(DESCRIPTION) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
        "COLORS ILIKE CONCAT('%', :query, '%') OR " +
        "tags ILIKE CONCAT('%', :query, '%')",
        nativeQuery = true)
        List<Product> search(@Param("query") String query);
}
