package stylosphere.models;

// Import Jakarta annotations
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

// Import Lombok annotations
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.Builder;

// Import from standard Java packages
import java.util.List;


@Entity
@DiscriminatorValue("Customer")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class Customer extends User
{
    private String shippingAddress;
    private String phoneNumber;
    private String paymentMethod;
}