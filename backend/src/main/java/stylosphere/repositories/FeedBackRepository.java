package stylosphere.repositories;

// Import from stylosphere packages
import stylosphere.models.feedback.*;

// Import from Spring Data JPA
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

// Import from standard Java packages
import java.util.List;

@Repository
public interface FeedBackRepository<T extends Message> extends JpaRepository<T, Long>
{
    // Retrieve messages by senderId
    List<T> findBySenderId(Long senderId);

    List<Comment> findByProductId(Long productId);
}