package com.Prototype.StyloSphere.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


import com.Prototype.StyloSphere.services.OrderService;
import com.Prototype.StyloSphere.classes.*;
import java.util.*;


@RestController
@RequestMapping("/api/cart")
public class OrderController {
    

    @Autowired
    private OrderService orderService;


@CrossOrigin(origins = "http://localhost:5173")
@PostMapping("/add-to-cart")
public ResponseEntity<String> addToCart(@RequestParam Long productId, 
                        @RequestParam String color, 
                        @RequestParam String size, 
                        @RequestParam int quantity,
                        @RequestParam Long userId)
{
    Order newOrder = new Order(productId, userId, color, size, quantity);
    try{
    orderService.saveOrder(newOrder);
    }catch(Exception e)
    {
        return ResponseEntity.badRequest().body("Failed to add to cart");
    }
    return ResponseEntity.ok("Added to cart successfully");
}

@GetMapping("/retrieve-cart")
public ResponseEntity<List<Order>> getCartItems(@RequestParam Long userId)
{
    return ResponseEntity.ok(orderService.getCartItems(userId));
}


@PostMapping("/update-quantity")
public ResponseEntity<String> updateQuantity(@RequestParam Long id , @RequestParam int newQuantity)
{
    try{
        orderService.updateQuantity(id , newQuantity);
    }catch(Exception e)
    {
        return ResponseEntity.badRequest().body("Failed to update quantity");
    }
    return ResponseEntity.ok("Updated quantity");
}
@PostMapping("/delete-order")

public ResponseEntity<String> deleteOrder(@RequestParam Long orderId)
{
    try{
        orderService.delete(orderId);
    }catch(Exception e)
    {
        return ResponseEntity.badRequest().body("Failed to delete order");
    }
    return ResponseEntity.ok("Order deleted");
}
@PostMapping("/get-id")
public ResponseEntity<Long> getOrderId(@RequestParam Long productId, 
                                        @RequestParam Long customerId, 
                                        @RequestParam String color, 
                                        @RequestParam String size)
{
    Long id = orderService.getId(productId , customerId , color , size);
    return ResponseEntity.ok(id);
}
}
