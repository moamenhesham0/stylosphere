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
    @PostMapping("/filter-tags")
    public ResponseEntity<List<Product>> filterByTags(@RequestBody Map<String, List<String>> body) {
        try {
            List<String> tags = body.get("selectedTags");
            
            
            List<Product> filteredProducts = tags.isEmpty()? productService.getBaseList() :productService.filterByTags(tags);

            return ResponseEntity.ok(filteredProducts);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ArrayList<>());
        }
    }

    @GetMapping("/filter-colors")
    public ResponseEntity<List<Product>> filterByColors(@RequestBody Map<String, List<String>> body) {
        try {
            List<String> colors = body.get("colors");

            List<Product> filteredProducts = productService.filterByColor(colors);

            return ResponseEntity.ok( filteredProducts);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
}

    



    
