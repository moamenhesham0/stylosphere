package com.Prototype.StyloSphere.Controllers;

import com.Prototype.StyloSphere.classes.*;

import com.Prototype.StyloSphere.services.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "http://localhost:5173")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    // Log in
    @PostMapping("/signin")
public ResponseEntity<Map<String, String>> signIn(@RequestBody Map<String, String> loginDetails) {
    String email = loginDetails.get("email");
    String password = loginDetails.get("password");

    boolean authenticated = customerService.signIn(email, password);

    if (authenticated) {
        // Return JSON response for successful sign-in
        return ResponseEntity.ok(Map.of("message", "Sign-in successful!", "status", "SUCCESS"));
    } else {
        // Return JSON response for failed sign-in
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid email or password", "status", "FAILURE"));
    }
}

    @PostMapping("/signup")
public ResponseEntity<Map<String, String>> signUp(@RequestBody Customer customer) {
    boolean success = customerService.signUp(customer);

    if (success) {
        // Return JSON response for success
        return ResponseEntity.ok(Map.of("message", "Sign-up successful! You can now log in."));
    } else {
        // Return JSON response for failure
        return ResponseEntity.badRequest().body(Map.of("message", "Sign-up failed. Email may already be in use."));
    }
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
