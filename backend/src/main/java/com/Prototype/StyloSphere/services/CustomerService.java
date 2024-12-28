package com.Prototype.StyloSphere.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import com.Prototype.StyloSphere.repositories.*;
import com.Prototype.StyloSphere.classes.*;
import java.util.*;
@Service
public class CustomerService {
    
    @Autowired
    private UserRepository<Customer> customerRepository;
    @Autowired
    private OrderRepository orderRepository;

    public void addOrderToCart(Long customerId , Order order)   
    {
        Long orderId = orderRepository.save(order).getId();
        Customer customer = customerRepository.findById(customerId).get();
        customer.getCart().addProductToCart(orderId);
        customerRepository.save(customer);
    }

    public List<Order> getCartItems(Long customerId)
    {
        Customer customer = customerRepository.findById(customerId).get();
        List<Long> cartIds= customer.getCart().getCartItems();
        List<Order> cartItems = new ArrayList<>();
        for(Long id : cartIds)
        {
            Order item = orderRepository.findById(id).get();
            cartItems.add(item);
        }
        return cartItems;
    }

    
}
