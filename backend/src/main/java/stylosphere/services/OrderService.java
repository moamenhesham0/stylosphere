package stylosphere.services;

// Import from stylosphere packages
import stylosphere.models.product.Product;
import stylosphere.models.order.Order;
import stylosphere.models.user.Customer;
import stylosphere.repositories.OrderRepository;
import stylosphere.repositories.ProductRepository;
import stylosphere.repositories.UserRepository;

// Import from Spring Service and Autowired
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

// Import from standard Java packages
import java.util.List;
import java.util.Optional;

@Service
public class OrderService
{
    @Autowired
    private UserRepository<Customer> customerRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    /**
     * Saves an order to the database.
     * If the order already exists, it updates the quantity.
     * If the product's quantity is less than the requested quantity, it caps the order at the maximum available quantity.
     *
     * @param order The order to be saved or updated.
     */
    public void saveOrder(Order order)
    {
        Order orderToSave = order;
        Optional<Order> existingOrder = orderRepository.findCartItem(order);
        final int maxQuantity = productRepository.findById(order.getProductId()).get().getQuantity();
        final int newQuantity = order.getQuantity();

        if (existingOrder.isEmpty())
        {
            orderToSave.setQuantity(Math.min(newQuantity, maxQuantity));
        }
        else
        {
            // For existing order, cap total at max quantity
            orderToSave = existingOrder.get();
            int currentQuantity = orderToSave.getQuantity() + newQuantity;
            orderToSave.setQuantity(Math.min(currentQuantity, maxQuantity));
        }
        orderRepository.save(orderToSave);
    }

    /**
     * Fetches all orders for a specific customer.
     *
     * @param customerId The ID of the customer whose orders are to be fetched.
     * @return List of orders for the customer.
     */
    public List<Order> getCartItems(Long customerId)
    {
        List<Order> cartItems = orderRepository.findByCustomerId(customerId);
        return cartItems;
    }

    /**
     * Updates the quantity of an order.
     *
     * @param orderId The ID of the order to be updated.
     * @param newQuantity The new quantity to set for the order.
     */
    public void updateQuantity(Long orderId , int newQuantity)
    {
        Order order = orderRepository.findById(orderId).get();
        order.setQuantity(newQuantity);
        orderRepository.save(order);
    }

    /**
     * Deletes an order by its ID.
     *
     * @param orderId The ID of the order to be deleted.
     */
    public void delete(Long orderId)
    {
        orderRepository.deleteById(orderId);
    }

    /**
     * Fetches the ID of an order based on productId, customerId, color, and size.
     * If no such order exists, returns INVALID_ORDER_ID.
     *
     * @param productId The ID of the product.
     * @param customerId The ID of the customer.
     * @param color The color of the product.
     * @param size The size of the product.
     * @return The ID of the order or INVALID_ORDER_ID if not found.
     */
    public Long getId(Long productId , Long customerId , String color , String size)
    {
        Order order = Order.builder()
                .productId(productId)
                .customerId(customerId)
                .color(color)
                .size(size)
                .build();
        Optional<Order> existingOrder = orderRepository.findCartItem(order);

        return existingOrder.isEmpty() ? Order.INVALID_ORDER_ID : existingOrder.get().getId();
    }

}
