package stylosphere.models.loghistory;

// Import Jakarta annotations
import jakarta.persistence.Entity;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Table;

// Import Lombok annotations
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "user_log")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UserLog
{
    @EmbeddedId
    private UserLogId id;

    private String device;
    private String browser;

    /**
     * Constructor to create a UserLog with the current timestamp.
     *
     * @param user  the user
     * @param device  the device used by the user
     * @param browser the browser used by the user
     */
    public UserLog(User user , String device, String browser)
    {
        this.id = new UserLogId(user, new Date());
        this.device = device;
        this.browser = browser;
    }
}
