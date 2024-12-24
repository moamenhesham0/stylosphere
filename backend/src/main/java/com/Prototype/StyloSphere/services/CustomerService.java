package com.Prototype.StyloSphere.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import com.Prototype.StyloSphere.repositories.*;
import com.Prototype.StyloSphere.classes.Customer;
@Service
public class CustomerService {
    
    @Autowired
    private UserRepository<Customer> customerRepository;


    public void addOrderToCart(Long customerId , Long orderId)
    {
        Customer customer = customerRepository.findById(customerId).get();
        customer.getCart().addProductToCart(orderId);
        customerRepository.save(customer);
    }

    
}
