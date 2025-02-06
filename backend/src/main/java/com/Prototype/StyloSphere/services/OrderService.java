package com.Prototype.StyloSphere.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.Prototype.StyloSphere.repositories.ProductRepository;
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
    @Autowired
    private ProductRepository productRepository;

    public void saveOrder(Order order) {
    Optional<Order> existingOrder = orderRepository.findByProductIdAndCustomerIdAndColorAndSize(
            order.getProductId(), order.getCustomerId(), order.getProductColor(), order.getProductSize());
    final int maxQuantity = productRepository.findById(order.getProductId()).get().getQuantity();

    if (existingOrder.isEmpty()) {
        // For new order, cap at max quantity
        if (order.getQuantity() > maxQuantity) {
            order.setQuantity(maxQuantity);
        }
        orderRepository.save(order);
    } else {
        // For existing order, cap total at max quantity
        Order existing = existingOrder.get();
        int newQuantity = existing.getQuantity() + order.getQuantity();
        if (newQuantity > maxQuantity) {
            newQuantity = maxQuantity;
        }
        existing.setQuantity(newQuantity);
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
