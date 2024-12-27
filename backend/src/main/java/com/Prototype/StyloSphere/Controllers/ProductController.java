package com.Prototype.StyloSphere.Controllers;

import com.Prototype.StyloSphere.classes.Product;
import com.Prototype.StyloSphere.services.ProductService;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {

    @Autowired
    private ProductService productService;




    @GetMapping("all")
    public ResponseEntity<List<Product>> retrieveAll()
    {
        return ResponseEntity.ok(productService.getBaseList());
    }
    @PostMapping("/add-product")
    public ResponseEntity<Map<String,String>> addProduct(@RequestBody Product product)
    {
        try{
            productService.saveProduct(product);
            return ResponseEntity.ok(Map.of("status" , "Success"));
        }catch (Exception e)
        {
            return ResponseEntity.ok(Map.of("status" , "Failed"));
        }
    }
    @PostMapping("/filter")
    public ResponseEntity<List<Product>> filterByTags(@RequestBody Map<String, List<String>> body) {
        try {
            List<String> tags = body.get("selectedTags");
            List<String> colors = body.get("selectedColors");
            
            List<Product> baseList = productService.getBaseList();
            List<Product> filteredByTags = tags.isEmpty()? baseList : productService.filterByTags(tags, baseList);
            List<Product> filteredProducts = colors.isEmpty()? filteredByTags :productService.filterByColor(colors, filteredByTags);

            return ResponseEntity.ok(filteredProducts);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ArrayList<>());
        }
    }
    @GetMapping("/best-sellers")
    public ResponseEntity<List<Product>> getBestSellers() {
        try {
            List<Product> bestSellers = productService.getTopBestSellers(5); // Top 5
            return ResponseEntity.ok(bestSellers);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ArrayList<>());
        }
    }

    @GetMapping("/discounts")
    public ResponseEntity<List<Product>> getDiscountedProducts() {
        try {
            List<Product> discountedProducts = productService.getDiscountedProducts();
            return ResponseEntity.ok(discountedProducts);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ArrayList<>());
        }
    }   
}

    



    
