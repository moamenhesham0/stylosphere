package stylosphere.models.product;

// Import Jakarta annotations
import jakarta.persistence.Table;
import jakarta.persistence.CascadeType;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;

// Import Jackson annotations
import com.fasterxml.jackson.annotation.JsonIgnore;

// Import Lombok annotations
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.Builder;

// Import from standard Java packages
import java.util.Set;
import java.util.HashSet;
import java.util.List;




@Entity
@Table(name = "products")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class Product
{
    static final int DEFAULT_SALES_COUNT = 0;
    static final int DESCRIPTION_MAX_LENGTH = 5000;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    @Column(length = DESCRIPTION_MAX_LENGTH)
    private String description;
    private double price;
    private int quantity;
    private double DiscountedPrice;
    private int SalesCount;

    
    private Set<String> sizes;
    private Set<String> styles;
    private Set<String> colors;
    private Set<String> tags;
    private String brand;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "product_id")
    List<Image> images;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "product", orphanRemoval = true)
    @JsonIgnore
    private List<ProductVariant> productVariant = new ArrayList<>();

    /**
     * Constructor for Product class.
     *
     * @param name        the name of the product
     * @param description the description of the product
     * @param tags        the tags associated with the product
     * @param price       the price of the product
     * @param quantity    the quantity of the product available
     * @param sizes       the sizes available for the product
     * @param styles      the styles available for the product
     * @param brand       the brand of the product
     * @param images      the list of images associated with the product
     * @param colors      the colors available for the product
     */
    public Product(String name, String description, Set<String> tags, double price, int quantity, Set<String> sizes, Set<String> styles, String brand, List<Image> images, Set<String> colors)
    {
        this.name = name;
        this.description = description;
        this.tags = tags;
        this.price = price;
        this.quantity = quantity;
        this.DiscountedPrice = price;
        this.SalesCount = DEFAULT_SALES_COUNT;
        this.sizes = sizes;
        this.styles = styles;
        this.brand = brand;
        this.images = images;
        this.colors = colors;
    }





}
