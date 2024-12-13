package com.Prototype.StyloSphere.Controllers;

import com.Prototype.StyloSphere.classes.*;

import com.Prototype.StyloSphere.services.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    // Log in
    @PostMapping("/login")
    public ResponseEntity<String> logIn(@RequestBody Customer customer) {
        boolean success = customerService.logIn(customer.getEmail(), customer.getPassword());
        return success
                ? ResponseEntity.ok("Login successful!")
                : ResponseEntity.badRequest().body("Invalid email or password.");
    }

    @PostMapping("/signup")
    public ResponseEntity<String> signUp(@RequestBody Customer customer) {
    boolean success = customerService.signUp(customer);
    return success
            ? ResponseEntity.ok("Sign-up successful! You can now log in.")
            : ResponseEntity.badRequest().body("Sign-up failed. Email may already be in use.");
}

    // Search products
    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProducts(@RequestParam String keyword) {
        List<Product> products = customerService.searchProducts(keyword);
        return ResponseEntity.ok(products);
    }

    // Place an order
    @PostMapping("/orders")
    public ResponseEntity<String> placeOrder(@RequestBody Order order) {
        customerService.placeOrder(order);
        return ResponseEntity.ok("Order placed successfully.");
    }

    // Checkout
    @PostMapping("/checkout")
    public ResponseEntity<String> checkOut(@RequestParam Long customerId) {
        customerService.checkOut(customerId);
        return ResponseEntity.ok("Checkout successful.");
    }
}
