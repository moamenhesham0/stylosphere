package stylosphere.repositories;

// Import from stylosphere packages
import stylosphere.classes.loghistory.*;

// Import from Spring Data JPA
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

// Import from standard Java packages
import java.util.List;

@Repository
public interface UserLogRepository extends JpaRepository<UserLog, UserLogId>
{
    List<UserLog> findByUserId(Long userId);
}
