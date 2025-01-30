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
    

    public Customer getCustomerById(Long id)
    {
        return customerRepository.findById(id).get();
    }

    
}
