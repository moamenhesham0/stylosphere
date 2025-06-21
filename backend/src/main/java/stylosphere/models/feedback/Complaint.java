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

// Import from standard Java package
import java.time.LocalDateTime;

@Entity
@Table(name = "complaint")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Complaint
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private String senderEmail;
    private LocalDateTime timeStamp;

    /**
     * Constructor to create a Complaint with the current timestamp.
     *
     * @param description  the description of the complaint
     * @param name         the name of the person making the complaint
     * @param senderEmail  the email of the person making the complaint
     */
    public Complaint(String description, String name, String senderEmail)
    {
        this.description = description;
        this.name = name;
        this.senderEmail = senderEmail;
        this.timeStamp = LocalDateTime.now();
    }
}
