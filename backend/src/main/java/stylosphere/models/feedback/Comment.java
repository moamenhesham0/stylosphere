package stylosphere.models.feedback;

// Import Jakarta annotations
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;

// Import Lombok annotations
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import stylosphere.models.User;

// Import from standard Java package
import java.Date;

@Entity
@Table(name = "comment")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    private String content;

    private Date timestamp;

    /**
     * Constructor to create a Comment with the current timestamp.
     *
     * @param userId   the ID of the user commenting
     * @param content  the content of the comment
     * @param productId the ID of the product being commented on
     */
    public Comment(String userId, String content, Long productId)
    {
        this.userId = userId;
        this.content = content;
        this.productId = productId;
        this.timestamp = new Date();
    }
}

