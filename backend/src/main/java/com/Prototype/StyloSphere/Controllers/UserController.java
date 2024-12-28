package com.Prototype.StyloSphere.Controllers;

import com.Prototype.StyloSphere.classes.*;

import com.Prototype.StyloSphere.services.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;



import java.util.*;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private CustomerService customerService;
// Log in
@PostMapping("/signin")
public ResponseEntity<Map<String, Object>> signIn(@RequestBody Map<String, String> loginDetails) {
    String email = loginDetails.get("email");
    String password = loginDetails.get("password");

    boolean authenticated = userService.signIn(email, password);

    if (authenticated) {
        User user = userService.getUser(email);
        
        // Return JSON status and user for successful sign-in
        return ResponseEntity.ok(Map.of("user", user  , "status" , "SUCCESS"));
    } else {
        // Return JSON status for failed sign-in
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("status", "FAILURE"));
    }
}

//sign up
    @PostMapping("/signup")
public ResponseEntity<Map<String, String>> signUp(@RequestBody Customer user) {
    boolean success = userService.signUp(user);
    System.out.println(success);
    if (success) {
        
        return ResponseEntity.ok(Map.of("message", "Sign-up successful"));
    } else {
        return ResponseEntity.badRequest().body(Map.of("message", "Sign-up failed. Email may already be in use."));
    }
}

@PostMapping("/photo-upload")
public ResponseEntity<Map<String,String>> uploadUserImage(@RequestBody Map<String,String> userImage)
{
    String email = userImage.get("email");
    String image = userImage.get("image");
    User user = userService.getUser(email);
    if(user != null){
        user.setUserImage(image);
        userService.saveUser(user);
        return ResponseEntity.ok(Map.of("status" , "Success"));
    }else
        return ResponseEntity.badRequest().body(Map.of("status" , "Failed"));
}

@PostMapping("/add-admin")
public ResponseEntity<Map<String,String>> addAdminApi(@RequestBody Map<String ,String> data)
{ 
    final String email = data.get("email");
    final String password = data.get("password");
    final String adminLevel = data.get("adminLevel");
  


    if (email == null || password == null || adminLevel == null) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                             .body(Map.of("status", "Invalid input data"));
    }

    boolean valid = userService.addAdmin(email, password, adminLevel);

    String message = valid ? "Admin added successfully." : "Error occurred";
    return ResponseEntity.ok(Map.of("status", message));
}

@DeleteMapping("/delete-admin")
public ResponseEntity<Map<String, String>> deleteAdmin(@RequestParam String email) {
    userService.deleteAdmin(email);
    return ResponseEntity.ok(Map.of("status", "Admin deleted successfully"));
}

@GetMapping("/get-user-id")
public ResponseEntity<User> getName(@RequestParam Long id)
{
    return ResponseEntity.ok(userService.getUser(id));
}
@GetMapping("/get-user-email")
public ResponseEntity<User> getName(@RequestParam String email)
{
    return ResponseEntity.ok(userService.getUser(email));
}


@CrossOrigin(origins = "http://localhost:5173")
@PostMapping("add-to-cart")
public ResponseEntity<String> addToCart(@RequestParam Long productId, 
                        @RequestParam String color, 
                        @RequestParam String size, 
                        @RequestParam int quantity,
                        @RequestParam Long userId)
{
    Order newOrder = new Order(productId, color, size, quantity);
    try{
    customerService.addOrderToCart(userId, newOrder);
    }catch(Exception e)
    {
        return ResponseEntity.badRequest().body("Failed to add to cart");
    }
    return ResponseEntity.ok("Added to cart successfully");
}

@GetMapping("retrieve-cart")
public ResponseEntity<List<Order>> getCartItems(@RequestParam Long userId)
{
    return ResponseEntity.ok(customerService.getCartItems(userId));
}

}
