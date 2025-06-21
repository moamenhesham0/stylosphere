package stylosphere.models.loghistory;

// Import Jakarta annotations
import jakarta.persistence.Embeddable;

// Import Lombok annotations
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import stylosphere.models.User;
import lombok.EqualsAndHashCode;

// Import from standard Java packages
import java.util.Date;
import java.io.Serializable;

@Embeddable
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@EqualsAndHashCode
public class UserLogId implements Serializable
{
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
    
    private Date timeStamp;
}
