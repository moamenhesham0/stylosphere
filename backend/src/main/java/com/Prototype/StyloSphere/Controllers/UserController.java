package com.Prototype.StyloSphere.Controllers;

import com.Prototype.StyloSphere.classes.*;

import com.Prototype.StyloSphere.services.*;

import org.apache.catalina.connector.Response;
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
public ResponseEntity<Boolean> signUp(@RequestBody Customer user) {
    Boolean success = false;
    try{
    success = userService.signUp(user);
    }catch(Exception e){
        return ResponseEntity.badRequest().body(false); 
    }
    return ResponseEntity.ok(success);
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



@PostMapping("/update-name")  
public ResponseEntity<String> updateName(@RequestParam Long userId , @RequestParam String name)
{
    Customer user = customerService.getCustomerById(userId);
    user.setName(name);
    userService.saveUser(user);
    return ResponseEntity.ok("Name updated successfully");
}

@PostMapping("/update-email")
public ResponseEntity<String> updateEmail(@RequestParam Long userId , @RequestParam String email)
{
    Customer user = customerService.getCustomerById(userId);
    user.setEmail(email);
    userService.saveUser(user);
    return ResponseEntity.ok("Email updated successfully");
}

@PostMapping("/update-password")
public ResponseEntity<String> updatePassword(@RequestParam Long userId , @RequestParam String password)
{
    Customer user = customerService.getCustomerById(userId);
    user.setPassword(password);
    userService.saveUser(user);
    return ResponseEntity.ok("Password updated successfully");
}

@PostMapping("/update-phone")
public ResponseEntity<String> updatePhone(@RequestParam Long userId , @RequestParam String phone)
{
    Customer user = customerService.getCustomerById(userId);
    user.setPhoneNumber(phone);
    userService.saveUser(user);
    return ResponseEntity.ok("Phone updated successfully");
}
@PostMapping("/update-address")
public ResponseEntity<String> updateAddress(@RequestParam Long userId , @RequestParam String address)
{
    Customer user = customerService.getCustomerById(userId);
    user.setShippingAddress(address);
    userService.saveUser(user);
    return ResponseEntity.ok("Address updated successfully");
}

@GetMapping("/check-password")
public ResponseEntity<Boolean> checkPassword(@RequestParam Long userId , @RequestParam String password)
{
    Customer user = customerService.getCustomerById(userId);
    return ResponseEntity.ok(user.getPassword().equals(password));
}


@GetMapping("sumUsers")
public int sumOurUsers(){
    
    return userService.sumOurUsers();
}


}
