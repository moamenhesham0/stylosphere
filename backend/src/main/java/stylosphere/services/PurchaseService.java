package stylosphere.services;

// Import from stylosphere packages
import stylosphere.models.order.*;
import stylosphere.models.product.Product;
import stylosphere.repositories.OrderRepository;
import stylosphere.repositories.ProductRepository;

// Import from Spring Service and Autowired
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


// Import from standard Java packages
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Arrays;
import java.util.stream.Collectors;


@Service
public class PurchaseService
{
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository OrderRepository;

    /**
     * Fetches all Orders from the database.
     * @return List of all Orders.
     */
    public List<Order> getAllPurchases()
    {
        return OrderRepository.findAll();
    }

    /**
     * Saves a purchase to the database.
     * @param purchase The purchase to be saved.
     */
    public void savePurchase(Order purchase, Long customerId)
    {
        Optional<Order> existingOrder = OrderRepository.findCartItem(purchase);
        if(existingOrder.isEmpty())
        {
            throw new RuntimeException("Order not found in the cart");
        }
        purchase = existingOrder.get();
        purchase.updateToPurchased();
        OrderRepository.save(purchase);
    }

    /**
     * Fetches purchases made by a specific customer.
     * @param customerId The ID of the customer whose purchases are to be fetched.
     * @return List of purchases made by the customer.
     */
    public List<Order> getPurchasesByCustomerId(Long customerId)
    {
        return OrderRepository.findByCustomerId(customerId);
    }

    public List<Order> getOrdersByTimeStamp(Date timeStamp)
    {
        return OrderRepository.findByTimeStamp(timeStamp);
    }

    public List<Order> getOrdersByProductId(Long productId)
    {
        return OrderRepository.findByProductId(productId);
    }

    public Optional<Order> getOrderDetails(Long OrderId)
    {
        return OrderRepository.findById(OrderId);
    }

    public void deleteOrder(Long OrderId)
    {
        OrderRepository.deleteById(OrderId);
    }

    public Map<String, Object> getIncomeData(String timeRange) {
        List<String> labels = new ArrayList<>();
        List<Integer> data = new ArrayList<>();

        LocalDate startDate;
        LocalDate endDate = LocalDate.now();
        String timePattern;

        try {
            switch (timeRange) {
                case "This Year":
                    startDate = endDate.with(TemporalAdjusters.firstDayOfYear());
                    timePattern = "Month"; // Aggregate by month
                    for (int i = 1; i <= 12; i++) {
                        labels.add(endDate.withMonth(i).getMonth().name());
                        data.add(0);
                    }
                    break;
                case "Last 30 Days":
                    startDate = endDate.minusDays(30);
                    timePattern = "YYYY-MM-DD"; // Aggregate by day
                    for (int i = 0; i < 30; i++) {
                        labels.add(startDate.plusDays(i).toString());
                        data.add(0);
                    }
                    break;
                case "This Month":
                    startDate = endDate.with(TemporalAdjusters.firstDayOfMonth());
                    timePattern = "YYYY-MM-DD"; // Aggregate by day
                    for (int i = 1; i <= endDate.lengthOfMonth(); i++) {
                        labels.add(startDate.plusDays(i - 1).toString());
                        data.add(0);
                    }
                    break;
                default: // "All Time"
                    startDate = LocalDate.of(2000, 1, 1); // Assuming data starts from the year 2000
                    timePattern = "Month"; // Aggregate by month
                    for (int i = 1; i <= 12; i++) {
                        labels.add(endDate.withMonth(i).getMonth().name());
                        data.add(0);
                    }
                    break;
            }

            // Fetch income data from the database
            List<Object[]> incomeData = OrderRepository.findIncomeData(startDate, endDate, timePattern);
            for (Object[] row : incomeData) {
                String label = row[0].toString();
                int index = labels.indexOf(label);

                if (index == -1) {
                    System.err.println("Warning: Label not found - " + label);
                    continue;
                }

                data.set(index, ((Number) row[1]).intValue());
            }

            Map<String, Object> dataset = new HashMap<>();
            dataset.put("label", "Total Income");
            dataset.put("data", data);
            dataset.put("backgroundColor", "#c3ad71");

            Map<String, Object> result = new HashMap<>();
            result.put("labels", labels);
            result.put("datasets", Collections.singletonList(dataset));

            return result;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error occurred while fetching income data", e);
        }
    }
        public List<Map<String, Object>> getSalesByYear() {
        List<Object[]> results = OrderRepository.getYearlySales();
        return results.stream().map(record -> {
            Map<String, Object> map = new HashMap<>();
            map.put("year", record[0]);
            map.put("totalQuantity", record[1]);
            return map;
        }).collect(Collectors.toList());
        }

        public List<Map<String, Object>> getSalesByMonth() {
            List<Object[]> results = OrderRepository.getMonthlySales();
            return results.stream().map(record -> {
                Map<String, Object> map = new HashMap<>();
                map.put("year", record[0]);
                map.put("month", record[1]);
                map.put("totalQuantity", record[2]);
                return map;
            }).collect(Collectors.toList());
        }

        public List<Map<String, Object>> getSalesByDay() {
            List<Object[]> results = OrderRepository.getDailySales();
            return results.stream().map(record -> {
                Map<String, Object> map = new HashMap<>();
                map.put("date", record[0]);
                map.put("totalQuantity", record[1]);
                return map;
            }).collect(Collectors.toList());
        }
        public double calculateTotalIncome() {
             List<Order> Orders = OrderRepository.findAll();
            double totalIncome = 0.0;

            for (Order Order : Orders) {
                Product product = productRepository.findById(Order.getProductId()).orElse(null);
                if (product != null) {
                    totalIncome += product.getPrice() * Order.getQuantity();
                    System.out.println("totalIncome" + totalIncome);
                } else {
                    System.out.println("Product not found for ID: " + Order.getProductId());
                }
            }
            return totalIncome;
        }

        public List<Order> getAllOrders() {
            try {
                return OrderRepository.findAllOrdersByTimestampDesc();
            } catch (Exception e) {
                System.err.println("Error fetching orders: " + e.getMessage());
                return new ArrayList<>();
            }
        }

        public void updateShipmentStatus(Long orderId, String status) {
            Order Order = OrderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));

            // Validate status
            String upperStatus = status.toUpperCase();
            if (!isValidStatus(upperStatus)) {
                throw new IllegalArgumentException("Invalid status: " + status);
            }

            Order.setShipmentStatus(upperStatus);
            OrderRepository.save(Order);
        }

        private boolean isValidStatus(String status) {
            return Arrays.asList("PENDING", "SHIPPED", "DELIVERED", "CANCELLED")
                .contains(status);
        }
}