package stylosphere.repositories;

// Import from stylosphere packages
import stylosphere.models.feedback.Comment;

// Import from Spring Data JPA
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long>
{
}

