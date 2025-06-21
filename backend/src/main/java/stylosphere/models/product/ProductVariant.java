package stylosphere.models.product;

// Import Jakarta annotations
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

// Import Lombok annotations
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.Builder;

// Import standard Java packages
import java.util.ArrayList;
import java.util.List;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class ProductVariant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String size;
    private String color;
    private int quantity;
    private double price;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "subproduct_id")
    private List<Image> images;



    /**
     * Constructor for ProductVariant class.
     *
     * @param size     the size of the product variant
     * @param color    the color of the product variant
     * @param quantity the quantity of the product variant
     * @param price    the price of the product variant
     * @param product  the product associated with this variant
     * @param images   the list of images associated with this variant
     */
    public ProductVariant(String size, String color, int quantity, double price, Product product, List<Image> images)
    {
        this.size = size;
        this.color = color;
        this.quantity = quantity;
        this.price = price;
        this.product = product;
        this.images = images;
    }
}
