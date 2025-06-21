package stylosphere.repositories;

// Import models
import stylosphere.models.wishlist.*;

// Import Spring Data JPA annotations
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

// Import Java libraries
import java.util.List;

@Repository
public interface WishListRepository extends JpaRepository<WishListItem, WishListItemId>
{

    /**
     * Finds all wish list items for a given customer ID.
     *
     * @param customerId the ID of the customer
     * @return a list of wish list items associated with the customer
     */

    @Query("SELECT w FROM WishListItem w WHERE w.id.customerId = :customerId")
    List<WishListItem> findByIdCustomerId(@Param("customerId") Long customerId);
}
