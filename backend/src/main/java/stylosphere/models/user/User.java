package stylosphere.models;

// Import Jakarta annotations
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.DiscriminatorColumn;
import jakarta.persistence.DiscriminatorType;
import jakarta.persistence.Table;

// Import Lombok annotations
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;


@Entity
@Table(name = "Users")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "type", discriminatorType = DiscriminatorType.STRING)
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public abstract class User
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String email;
    private String password;

    @Lob
    private String userImage;


    /**
     * Constructor for User class.
     *
     * @param name     the name of the user
     * @param email    the email of the user
     * @param password the password of the user
     */
    public User(String name, String email, String password)
    {
        this.name = name;
        this.email = email;
        this.password = password;
    }

    /**
     * Returns the type of the user as a string.
     *
     * @return the type of the user,
     * whether the user is an Admin or a Customer.
     */
    public String getType()
    {
        return this.getClass().getSimpleName().toLowerCase();
    }

}