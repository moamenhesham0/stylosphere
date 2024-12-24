package com.Prototype.StyloSphere.services;

import org.springframework.stereotype.Service;

import com.Prototype.StyloSphere.repositories.PurchaseRepository;
import com.Prototype.StyloSphere.classes.Purchase;
import java.util.*;
@Service
public class PurchaseService {
    private PurchaseRepository purchaseRepository;

    public List<Purchase> getAllPurchases()
    {
        return purchaseRepository.findAll();
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
}
