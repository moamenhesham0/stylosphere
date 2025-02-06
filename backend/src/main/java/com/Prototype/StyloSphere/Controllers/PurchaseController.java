package com.Prototype.StyloSphere.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.Prototype.StyloSphere.classes.Purchase;
import com.Prototype.StyloSphere.services.PurchaseService;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/purchase")
@CrossOrigin(origins = "http://localhost:5173")
public class PurchaseController {
    
    @Autowired
    private PurchaseService purchaseService;

    @PostMapping("/save-purchase")
    public ResponseEntity<String> savePurchase(@RequestParam Long customerId , 
                            @RequestParam Long productId , 
                            @RequestParam String productColor, 
                            @RequestParam String productSize, 
                            @RequestParam int quantity)
    {
        try{
        Purchase purchase = new Purchase(customerId, productId, productColor, productSize, quantity);
        purchaseService.savePurchase(purchase , customerId);
        }catch(Exception e)
        {
            return ResponseEntity.badRequest().body("Failed to save purchase");
        }
        return ResponseEntity.ok("Purchase saved successfully");
    }

    @GetMapping("/income-data")
    public ResponseEntity<Map<String, Object>> getIncomeData(@RequestParam String timeRange) {
    List<Map<String, Object>> rawData;
    List<String> labels = new ArrayList<>();

    switch (timeRange.toLowerCase()) {
    //////    
        case "this year":
            rawData = purchaseService.getSalesByMonth();
            System.out.println("i was here also" + rawData);

            // Mapping month numbers to names
            Map<Integer, String> monthNames = Map.ofEntries(
                Map.entry(1, "January"), Map.entry(2, "February"), Map.entry(3, "March"), Map.entry(4, "April"),
                Map.entry(5, "May"), Map.entry(6, "June"), Map.entry(7, "July"), Map.entry(8, "August"),
                Map.entry(9, "September"), Map.entry(10, "October"), Map.entry(11, "November"), Map.entry(12, "December")
            );

            // Pre-fill all months to ensure missing months are present
            Map<String, Long> monthSalesMap = new LinkedHashMap<>();
            for (int i = 1; i <= 12; i++) {
                monthSalesMap.put(monthNames.get(i), 0L); // Default sales to 0
            }

            // Populate actual sales data
            for (Map<String, Object> entry : rawData) {
                int monthNumber = ((Number) entry.get("month")).intValue();
                long totalQuantity = ((Number) entry.get("totalQuantity")).longValue();
                monthSalesMap.put(monthNames.get(monthNumber), totalQuantity);
            }

            labels = new ArrayList<>(monthSalesMap.keySet());
            rawData = List.of(Map.of("totalQuantity", new ArrayList<>(monthSalesMap.values())));
            break;
///////
        case "this month":
    rawData = purchaseService.getSalesByDay();
    Map<Integer, Long> dailySalesMap = new LinkedHashMap<>();
    
    // Get current month's length
    int daysInMonth = YearMonth.now().lengthOfMonth();
    
    // Initialize all days with 0
    for (int i = 1; i <= daysInMonth; i++) {
        dailySalesMap.put(i, 0L);
    }
    
    // Safely populate sales data
    for (Map<String, Object> entry : rawData) {
        Object dateObj = entry.get("date");
        Object quantityObj = entry.get("totalQuantity");
        
        if (dateObj != null && quantityObj != null) {
            int day = ((Number) dateObj).intValue();
            long quantity = ((Number) quantityObj).longValue();
            dailySalesMap.put(day, quantity);
        }
    }
    
    // Create labels and dataset
    labels = dailySalesMap.keySet().stream()
            .map(String::valueOf)
            .collect(Collectors.toList());
            
    List<Long> values = new ArrayList<>(dailySalesMap.values());
    
    // Format response
    Map<String, Object> dataset = new HashMap<>();
    dataset.put("label", "Sales Quantity");
    dataset.put("data", values);
    
    Map<String, Object> response = new HashMap<>();
    response.put("labels", labels);
    response.put("datasets", Collections.singletonList(dataset));
    
    return ResponseEntity.ok(response);                        ////////////dont ask why return here not below it worked 
         
//////
      default: // All Time (Sales by Year)
        rawData = purchaseService.getSalesByYear();

        Map<Integer, Long> yearSalesMap = new LinkedHashMap<>();
        
        // Get current year and last 10 years
        int currentYear = LocalDate.now().getYear();
        List<Integer> lastTenYears = new ArrayList<>();
        for (int i = currentYear - 10; i <= currentYear; i++) {
            lastTenYears.add(i);
            yearSalesMap.put(i, 0L); // Default to 0 sales
        }
        
        // Populate sales data
        for (Map<String, Object> entry : rawData) {
            int year = ((Number) entry.get("year")).intValue();
            long totalQuantity = ((Number) entry.get("totalQuantity")).longValue();
            yearSalesMap.put(year, totalQuantity);
        }
        
        // Ensure years are in order and format labels
        labels = lastTenYears.stream().map(String::valueOf).toList();
        
        // Extract sales data in order
        rawData = List.of(Map.of("totalQuantity", new ArrayList<>(yearSalesMap.values())));
        
            break;
    }

    // Extract sales data
    Object totalQuantityObj = rawData.get(0).get("totalQuantity");
    List<Long> values;
    if (totalQuantityObj instanceof List<?>) {
        values = ((List<?>) totalQuantityObj).stream()
                .filter(item -> item instanceof Long)
                .map(item -> (Long) item)
                .toList();
    } else {
        values = new ArrayList<>();
    }

    // Wrap in the correct format for React Chart.js
    Map<String, Object> formattedResponse = new HashMap<>();
    formattedResponse.put("labels", labels);
    formattedResponse.put("datasets", List.of(Map.of(
        "label", "Sales Quantity",
        "data", values
    )));

    System.out.println("Formatted Data: " + formattedResponse);

    return ResponseEntity.ok(formattedResponse);
}

    
    @GetMapping("/user-purchases")
    public ResponseEntity<List<Purchase>> getUserPurchases(@RequestParam Long userId)
    {
        List<Purchase> purchases = purchaseService.getPurchasesByCustomerId(userId);
        return ResponseEntity.ok(purchases);
    }

   @GetMapping("/totalIncome")
    public double getTotalIncome() {
        return purchaseService.calculateTotalIncome();
    }

    @GetMapping("/all-orders")
    public ResponseEntity<List<Purchase>> getAllOrders() {
        try {
            List<Purchase> orders = purchaseService.getAllOrders();
            if (orders.isEmpty()) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.ok(orders);
        } catch(Exception e) {
            System.err.println("Error in getAllOrders: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/update-status")
    public ResponseEntity<String> updateShipmentStatus(
        @RequestParam Long orderId,
        @RequestParam String status
    ) {
        try {
            purchaseService.updateShipmentStatus(orderId, status);
            return ResponseEntity.ok("Status updated successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to update status: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete-item")
    public ResponseEntity<String> deleteOrderItem(@RequestParam Long orderId) {
        if (orderId == null) {
            return ResponseEntity.badRequest().body("OrderId cannot be null");
        }
        
        try {
            purchaseService.deletePurchase(orderId);
            return ResponseEntity.ok("Item deleted successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid order ID: " + orderId);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to delete item: " + e.getMessage());
        }
    }
}
