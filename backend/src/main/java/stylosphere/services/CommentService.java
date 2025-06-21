package stylosphere.services;

// Import from stylosphere packages
import stylosphere.classes.feedback.Comment;
import stylosphere.repositories.CommentRepository;
import stylosphere.repositories.MessageRepository;

// Import from Spring Service and Autowired
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

// Import from standard Java packages
import java.util.List;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    /**
     * Fetches all comments from the database.
     * @return List of all comments.
     */
    public List<Comment> getAllComments()
    {
        return commentRepository.findAll();
    }

    /**
     * Saves a comment to the database.
     * @param comment The comment to be saved.
     * @return The saved comment.
     */
    public Comment save(Comment comment)
    {
        return commentRepository.save(comment);
    }

    /**
     * Fetches comments made by a specific user.
     * @param userId The ID of the user whose comments are to be fetched.
     * @return List of comments made by the user.
     */
    public List<Comment> getCommentsByUserId(Long userId)
    {
        return commentRepository.findByUserId(userId);
    }

    /**
     * Fetches comments for a specific product.
     * @param productId The ID of the product whose comments are to be fetched.
     * @return List of comments for the product.
     */
    public List<Comment> getProductComments(Long productId)
    {
        try
        {
            return commentRepository.findByProductId(productId);
        }
        catch (Exception e)
        {
            throw new RuntimeException("Failed to fetch comments", e);
        }
    }

    /**
     * Deletes a comment by its ID.
     * @param commentId The ID of the comment to be deleted.
     */
    public void deleteComment(Long commentId)
    {
        try
        {
            commentRepository.deleteById(commentId);
        }
        catch (Exception e)
        {
            throw new RuntimeException("Failed to delete comment", e);
        }
    }
}
