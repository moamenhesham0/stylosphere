package com.Prototype.StyloSphere.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.Prototype.StyloSphere.services.WishListService;
import com.Prototype.StyloSphere.classes.Product;
import java.util.*;
@RestController
@RequestMapping("/api/wishlist")
public class WishListController {
    @Autowired
    private WishListService wishListService;

    @GetMapping("/get-wishlist")
    public ResponseEntity<List<Product>> getWishList(@RequestParam Long customerId)
    {
        List<Product> wishList = new ArrayList<>();
        try {
            wishList = wishListService.getWishListProducts(customerId);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(wishList);
        }
        return ResponseEntity.ok(wishList);
    }


    @PostMapping("/remove-from-wishlist")
    public ResponseEntity<String> deleteFromWishList(@RequestParam Long customerId , @RequestParam Long productId)
    {
        try {
            wishListService.deleteProductFromWishList(customerId, productId);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Server failed to delete the product from the wishlist");
        }
        return ResponseEntity.ok("Wishlist product successfully deleted");
    }

    @PostMapping("/add-to-wishlist")
    public ResponseEntity<String> addToWishList(@RequestParam Long customerId , @RequestParam Long productId)
    {
        try {
            wishListService.saveProductToWishList(customerId, productId);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Server failed to save the product to the wishlist");
        }
        return ResponseEntity.ok("Wishlist product successfully added");
    }
}
