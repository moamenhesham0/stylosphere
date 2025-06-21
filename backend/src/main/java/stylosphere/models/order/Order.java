package stylosphere.models.order;

// Import Jakarta annotations
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.Table;

// Import Lombok annotations
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.Builder;

// Import from standard Java package
import java.util.Date;

@Entity
@Table(name = "order")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class Order
{
    public static enum OrderStatus
    {
        PENDING,
        DELIVERED,
        CANCELLED,
        REFUNDED
    }

    public static final Long INVALID_ORDER_ID = -1L;

    @Id
    @GeneratedValue(strategy = GenerationType.TABLE)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private Customer customer;

    private String productColor;
    private String productSize;
    private int quantity;
    private OrderStatus status;

    // Dates for various order states
    private Date purchaseDate;
    private Date deliveryDate;
    private Date cancellationDate;
    private Date refundDate;

    public Order(CartItem cartItem)
    {
        this.product = cartItem.getProduct();
        this.customer = cartItem.getCustomer();
        this.productColor = cartItem.getProductColor();
        this.productSize = cartItem.getProductSize();
        this.quantity = cartItem.getQuantity();
        this.status = OrderStatus.PENDING; // Default status when an order is created
    }

    public updateToPurchased()
    {
        this.status = OrderStatus.PENDING;
        setPurchaseDate();
    }

    public updateToDelivered()
    {
        this.status = OrderStatus.DELIVERED;
        setDeliveryDate();
    }

    public updateToCancelled()
    {
        this.status = OrderStatus.CANCELLED;
        setCancellationDate();
    }

    public updateToRefunded()
    {
        this.status = OrderStatus.REFUNDED;
        setRefundDate();
    }
}
