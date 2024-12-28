package com.Prototype.StyloSphere.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.Prototype.StyloSphere.repositories.*;
import com.Prototype.StyloSphere.classes.Cart;
import com.Prototype.StyloSphere.classes.Customer;
import com.Prototype.StyloSphere.classes.Purchase;
import java.util.*;
@Service
public class PurchaseService {
    @Autowired
    private PurchaseRepository purchaseRepository;
    @Autowired
    private UserRepository<Customer> customerRepository;
    @Autowired
    private OrderRepository orderRepository;
    public List<Purchase> getAllPurchases()
    {
        return purchaseRepository.findAll();
    }
    public void savePurchase(Purchase purchase , Long customerId)
    {
        Customer customer = customerRepository.findById(customerId).get();
        Cart cart = customer.getCart();
        for(Long orderId : cart.getCartItems())
        {
            orderRepository.deleteById(orderId);  
        }
        cart.clearCart();
        purchaseRepository.save(purchase);
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
