package stylosphere.models.product;

// Import Jakarta annotations
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;

// Import Lombok annotations
import lombok.Getter;
import lombok.Setter;

// Import from standard Java package
import java.util.Arrays;

@Entity
@Table(name = "images")
@Getter
@Setter
public class Image {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Lob
    private byte[] image;
    private String attType;
    private String attName;
    private float attSize;


    @Override
    public String toString()
    {
        return "image [image=" + Arrays.toString(image) + ", attType=" + attType + ", attName=" + attName
                + ", attSize=" + attSize + "]";
    }
}
