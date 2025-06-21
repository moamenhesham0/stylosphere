package stylosphere.models.wishlist;

// Import Jakarta annotations
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.EmbeddedId;

// Import Lombok annotations
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import stylosphere.models.Customer;

@Entity
@Table(name = "wish_list_item")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class WishListItem
{
    @EmbeddedId
    private WishListItemId id;

    public WishListItem(Customer customer, Product product)
    {
        this.id = new WishListItemId(customer, product);
    }
}
