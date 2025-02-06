package com.Prototype.StyloSphere.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.Prototype.StyloSphere.repositories.*;
import com.Prototype.StyloSphere.classes.Product;
import com.Prototype.StyloSphere.classes.Purchase;

import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.*;
import java.util.stream.Collectors;
@Service
public class PurchaseService {

    @Autowired
    private PurchaseRepository purchaseRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    public List<Purchase> getAllPurchases()
    {
        return purchaseRepository.findAll();
    }
    public void savePurchase(Purchase purchase , Long customerId)
    {
        purchaseRepository.save(purchase);
        orderRepository.deleteByCustomerId(customerId);
    }
    public List<Purchase> getPurchasesByCustomerId(Long customerId)
    {
        return purchaseRepository.findByCustomerId(customerId);
    }

    public List<Purchase> getPurchasesByTimeStamp(Date timeStamp)
    {
        return purchaseRepository.findByTimeStamp(timeStamp);
    }

    public List<Purchase> getPurchasesByProductId(Long productId)
    {
        return purchaseRepository.findByProductId(productId);
    }

    public Optional<Purchase> getPurchaseDetails(Long purchaseId)
    {
        return purchaseRepository.findById(purchaseId);
    }
    
    public void deletePurchase(Long purchaseId)
    {
        purchaseRepository.deleteById(purchaseId);
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
            List<Object[]> incomeData = purchaseRepository.findIncomeData(startDate, endDate, timePattern);
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
        List<Object[]> results = purchaseRepository.getYearlySales();
        return results.stream().map(record -> {
            Map<String, Object> map = new HashMap<>();
            map.put("year", record[0]);
            map.put("totalQuantity", record[1]);
            return map;
        }).collect(Collectors.toList());
        }

        public List<Map<String, Object>> getSalesByMonth() {
            List<Object[]> results = purchaseRepository.getMonthlySales();
            return results.stream().map(record -> {
                Map<String, Object> map = new HashMap<>();
                map.put("year", record[0]);
                map.put("month", record[1]);
                map.put("totalQuantity", record[2]);
                return map;
            }).collect(Collectors.toList());
        }

        public List<Map<String, Object>> getSalesByDay() {
            List<Object[]> results = purchaseRepository.getDailySales();
            return results.stream().map(record -> {
                Map<String, Object> map = new HashMap<>();
                map.put("date", record[0]);
                map.put("totalQuantity", record[1]);
                return map;
            }).collect(Collectors.toList());
        }
        public double calculateTotalIncome() {
             List<Purchase> purchases = purchaseRepository.findAll();
            double totalIncome = 0.0;

            for (Purchase purchase : purchases) {
                Product product = productRepository.findById(purchase.getProductId()).orElse(null);
                if (product != null) {
                    totalIncome += product.getPrice() * purchase.getQuantity();
                    System.out.println("totalIncome" + totalIncome);
                } else {
                    System.out.println("Product not found for ID: " + purchase.getProductId());
                }
            }
            return totalIncome;
        }
     
        public List<Purchase> getAllOrders() {
            try {
                return purchaseRepository.findAllOrdersByTimestampDesc();
            } catch (Exception e) {
                System.err.println("Error fetching orders: " + e.getMessage());
                return new ArrayList<>();
            }
        }

        public void updateShipmentStatus(Long orderId, String status) {
            Purchase purchase = purchaseRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));
            
            // Validate status
            String upperStatus = status.toUpperCase();
            if (!isValidStatus(upperStatus)) {
                throw new IllegalArgumentException("Invalid status: " + status);
            }
            
            purchase.setShipmentStatus(upperStatus);
            purchaseRepository.save(purchase);
        }
        
        private boolean isValidStatus(String status) {
            return Arrays.asList("PENDING", "SHIPPED", "DELIVERED", "CANCELLED")
                .contains(status);
        }
}
