package Backend.example.styloSphereBackend.model;
import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class Product {

    @Id
    private Long id;
    private String name;
    private String description;
    private double price;
    private String type;
    private String image;

    // Constructor, getters, and setters

    public Product() {}

    public Product(Long id, String name, String description, double price, String type, String image) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.type = type;
        this.image = image;
    }

    // Getters and setters...
}

