package com.Prototype.StyloSphere.services;

import com.Prototype.StyloSphere.classes.*;
import com.Prototype.StyloSphere.repositories.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository<User> userRepository;

    @Autowired
    private ComplaintRepository complaintRepository;

    public User getUser(Long id)
    {
        return userRepository.findById(id).get();
    }
    public User getUser(String email)
    {
        return userRepository.findByEmail(email);
    }

    public boolean addAdmin(String email , String password ,String adminLevel)
    {
        User user = userRepository.findByEmail(email);
        if(user!=null && user.getType().equalsIgnoreCase("admin"))
            return false;

        Admin newAdmin = new Admin();
        newAdmin.setEmail(email);
        newAdmin.setPassword(password);
        newAdmin.setAdminLevel(adminLevel);
        userRepository.save(newAdmin);
        return true;
        
    }

    public void saveUser(User user)
    {
        userRepository.save(user);
    }

    public void updateUserName(Long id , String newName)
    {
        User user = userRepository.findById(id).get();
        user.setName(newName);
        userRepository.save(user);  
    }
    public void updateUserEmail(Long id , String newEmail)
    {
        User user = userRepository.findById(id).get();
        user.setEmail(newEmail);
        userRepository.save(user);  
    }
    public void updateUserPassword(Long id , String newPassword)
    {
        User user = userRepository.findById(id).get();
        user.setPassword(newPassword);
        userRepository.save(user);  
    }

    public boolean signIn(String email, String password) {
        User user = userRepository.findByEmail(email);
        return user != null && user.getPassword().equals(password);
    }

    public Long signUp(Customer customer) {
        if (userRepository.findByEmail(customer.getEmail()) != null) {
            return -1L; 
        }
        
        userRepository.save(customer); 
        return customer.getId();    
    }

    public void deleteAdmin(String email) {
        User user = userRepository.findByEmail(email);
        if (user != null && user.getType().equalsIgnoreCase("admin")) {
            userRepository.deleteById(user.getId());
        }
    }

    public void saveComplain(Complain complaint) {
        complaintRepository.save(complaint);
    }
    public int sumOurUsers() {
        return (int)userRepository.countUsersWithNullAdminLevel();
    }
}
