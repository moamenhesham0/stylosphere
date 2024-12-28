package com.Prototype.StyloSphere.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.Prototype.StyloSphere.classes.Purchase;
import com.Prototype.StyloSphere.services.PurchaseService;
@RestController
@RequestMapping("/api/purchase")
@CrossOrigin(origins = "http://localhost:5173")
public class PurchaseController {
    
    @Autowired
    private PurchaseService purchaseService;


    @PostMapping("/save-purchase")
    public ResponseEntity<String> savePurchase(@RequestParam Long customerId , 
                            @RequestParam Long productId , 
                            @RequestParam String productColor, 
                            @RequestParam String productSize, 
                            @RequestParam int quantity)
    {
        try{
        Purchase purchase = new Purchase(customerId, productId, productColor, productSize, quantity);
        purchaseService.savePurchase(purchase , customerId);
        }catch(Exception e)
        {
            return ResponseEntity.badRequest().body("Failed to save purchase");
        }
        return ResponseEntity.ok("Purchase saved successfully");
    }
}
