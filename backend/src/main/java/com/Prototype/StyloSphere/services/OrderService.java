package com.Prototype.StyloSphere.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.Prototype.StyloSphere.repositories.OrderRepository;
import com.Prototype.StyloSphere.repositories.UserRepository;
import com.Prototype.StyloSphere.classes.*;

import java.util.*;
@Service
public class OrderService {
    

    @Autowired
    private UserRepository<Customer> customerRepository;
    @Autowired
    private OrderRepository orderRepository;


    public void saveOrder(Order order) {
    Optional<Order> existingOrder = orderRepository.findByProductIdAndCustomerIdAndColorAndSize(
            order.getProductId(), order.getCustomerId(), order.getProductColor(), order.getProductSize());
    
    if (existingOrder.isEmpty()) {
        // If no existing order is found, save the new order
        orderRepository.save(order);
    } else {
        // If an existing order is found, update its quantity
        Order existing = existingOrder.get();
        existing.setQuantity(existing.getQuantity() + order.getQuantity());
        orderRepository.save(existing);
    }
}


    public List<Order> getCartItems(Long customerId)
    {
        List<Order> cartItems = orderRepository.findByCustomerId(customerId);
        return cartItems;
    }
    public void updateQuantity(Long orderId , int newQuantity)
    {
        Order order = orderRepository.findById(orderId).get();
        order.setQuantity(newQuantity);
        orderRepository.save(order);
    }
    public void delete(Long orderId)
    {
        orderRepository.deleteById(orderId);
    }
    public Long getId(Long productId , Long customerId , String color , String size)
    {
        return orderRepository.findByProductIdAndCustomerIdAndColorAndSize(productId,customerId,color,size).get().getId();
    }
}
