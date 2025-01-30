package com.Prototype.StyloSphere.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.Prototype.StyloSphere.repositories.*;
import com.Prototype.StyloSphere.classes.Purchase;

import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.*;
@Service
public class PurchaseService {

    @Autowired
    private PurchaseRepository purchaseRepository;

    

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
    
}
