package stylosphere.models;

// Import Jakarta annotations
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

// Import Lombok annotations
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

// Import from standard Java packages
import java.util.List;


@Entity
@DiscriminatorValue("Admin")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Admin extends User {


    public static enum AdminLevel
    {
        SUPER_ADMIN,
        ADMIN,
    }

    private AdminLevel adminLevel;
    private List<String> promoCodes;

    /**
     * Constructor for Admin class.
     *
     * @param name       the name of the admin
     * @param email      the email of the admin
     * @param password   the password of the admin
     */
    public Admin(String name, String email, String password)
    {
        super(name, email, password);
        this.adminLevel = AdminLevel.ADMIN;
    }
    


}
