package com.Prototype.StyloSphere.Controllers;

import com.Prototype.StyloSphere.classes.Product;
import com.Prototype.StyloSphere.services.ProductService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private List<Product> convertToProducts(String productsJson) throws Exception {
        return objectMapper.readValue(productsJson, new TypeReference<List<Product>>() {});
    }

    private List<String> convertToListOfStrings(String listJson) throws Exception {
        return objectMapper.readValue(listJson, new TypeReference<List<String>>() {});
    }

    @GetMapping("/filter-tags")
    public ResponseEntity<Map<String, Object>> filterByTags(@RequestBody Map<String, String> body) {
        try {
            List<String> tags = convertToListOfStrings(body.get("tags"));
            List<Product> products = convertToProducts(body.get("products"));

            List<Product> filteredProducts = productService.filterByTags(tags, products);

            return ResponseEntity.ok(Map.of("filteredProducts", filteredProducts, "status", "Success"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("status", "Failed"));
        }
    }

    @GetMapping("/filter-colors")
    public ResponseEntity<Map<String, Object>> filterByColors(@RequestBody Map<String, String> body) {
        try {
            List<String> colors = convertToListOfStrings(body.get("colors"));
            List<Product> products = convertToProducts(body.get("products"));

            List<Product> filteredProducts = productService.filterByColor(colors, products);

            return ResponseEntity.ok(Map.of("filteredProducts", filteredProducts, "status", "Success"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("status", "Failed"));
        }
    }
}

    



    
