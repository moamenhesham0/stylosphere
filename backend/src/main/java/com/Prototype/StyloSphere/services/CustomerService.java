package com.Prototype.StyloSphere.services;

import com.Prototype.StyloSphere.classes.*;
import com.Prototype.StyloSphere.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    // Log in
    public boolean logIn(String email, String password) {
        Customer customer = customerRepository.findByEmail(email);
        return customer != null && customer.getPassword().equals(password);
    }

    // Search products
    public List<Product> searchProducts(String keyword) {
        return productRepository.findByNameContainingIgnoreCase(keyword);
    }

    // Place an order
    public void placeOrder(Order order) {
        orderRepository.save(order);
    }

    // Checkout
    public void checkOut(Long customerId) {
        Customer customer = customerRepository.findById(customerId).orElseThrow(() -> new RuntimeException("Customer not found"));
        // Add checkout logic here (e.g., clear cart, process payment)
        System.out.println("Customer checked out with payment method: " + customer.getPaymentMethod());
    }
}