package stylosphere.models.feedback;

// Import Jakarta annotations
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

// Import Lombok annotations
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import stylosphere.models.User;

// Import from standard Java package
import java.util.Date;

@Entity
@Table(name = "report")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Report{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reported_product_id")
    private Product reportedProduct;

    private String description;
    private Date timestamp;

    /**
     * Constructor to create a Report with the current timestamp.
     *
     * @param userId            the ID of the user reporting
     * @param description       the description of the report
     * @param reportedProductId the ID of the product being reported
     */
    public Report(String userId, String description, Long reportedProductId)
    {
        this.userId = userId;
        this.description = description;
        this.reportedProductId = reportedProductId;
        this.timestamp = new Date();
    }
}
