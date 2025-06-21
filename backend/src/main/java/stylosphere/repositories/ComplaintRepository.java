package stylosphere.repositories;

// Import from stylosphere packages
import stylosphere.models.feedback.Complaint;

// Import from Spring Data JPA
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long>
{
}

