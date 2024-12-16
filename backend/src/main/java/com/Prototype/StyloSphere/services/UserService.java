package com.Prototype.StyloSphere.services;

import com.Prototype.StyloSphere.classes.*;
import com.Prototype.StyloSphere.repositories.*;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;



@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // @Autowired
    // private ProductRepository productRepository;

    // @Autowired
    // private OrderRepository orderRepository;
    public User getUser(String email)
    {
        return userRepository.findByEmail(email);
    }

    public boolean signIn(String email, String password) {
        User user = userRepository.findByEmail(email);
        return user != null && user.getPassword().equals(password);
    }

    public void saveUser(User user)
    {
        userRepository.save(user);
    }
    

    public boolean signUp(Customer customer) {
        if (userRepository.findByEmail(customer.getEmail()) != null) {
            return false; 
        }
        
        userRepository.save(customer); 
        return true;    
    }
}
