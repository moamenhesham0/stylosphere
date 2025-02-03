package com.Prototype.StyloSphere.Controllers;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Base64;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.Prototype.StyloSphere.classes.Image;
import com.Prototype.StyloSphere.classes.Product;
import com.Prototype.StyloSphere.repositories.PurchaseRepository;
import com.Prototype.StyloSphere.services.PurchaseService;
import com.Prototype.StyloSphere.repositories.ProductRepository;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    @Autowired
    private PurchaseRepository purchaseRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private PurchaseService purchaseService;

    @GetMapping("/income-data")
    public ResponseEntity<Map<String, Object>> getIncomeData(@RequestParam String timeRange) {
        Map<String, Object> data = purchaseService.getIncomeData(timeRange);
        return ResponseEntity.ok(data);
    }

    @GetMapping("/best-sellers")
    public ResponseEntity<List<Map<String, Object>>> getBestSellers(@RequestParam String period) {
        List<Map<String, Object>> bestSellers = purchaseRepository.findBestSellers();
        return ResponseEntity.ok(bestSellers);
    }

    @PostMapping(value = "/add-product", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public void addProduct(
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("tags") String tags,
            @RequestParam("price") double price,
            @RequestParam("quantity") int quantity,
            @RequestParam("colors") String colors,
            @RequestParam("images") MultipartFile[] images,
            @RequestParam("discountedPrice") double discountedPrice,
            @RequestParam("sizes") String sizes,
            @RequestParam("styles") String styles,
            @RequestParam("brand") String brand) {

            List<Image> imageList = new ArrayList<>();
            if (images != null && images.length > 0) {
                for (MultipartFile file : images) {
                    try {
                        Image img = new Image();
                        img.setimage(file.getBytes());
                        img.setAttName(file.getOriginalFilename());
                        img.setAttType(file.getContentType());
                        img.setAttSize(file.getSize() / 1024.0f); 
                        imageList.add(img);
                    } catch (IOException e) {
                        throw new RuntimeException("Failed to process attachment: " + file.getOriginalFilename(), e);
                    }
                }
            }    

            Set<String> tagSet = Arrays.stream(tags.split(",")).map(String::trim).collect(Collectors.toSet());
            Set<String> colorSet = Arrays.stream(colors.split(",")).map(String::trim).collect(Collectors.toSet());
            Set<String> sizeSet = Arrays.stream(sizes.split(",")).map(String::trim).collect(Collectors.toSet());
            Set<String> styleSet = Arrays.stream(styles.split(",")).map(String::trim).collect(Collectors.toSet());

            Product product = new Product(name, description, price, imageList, tagSet, colorSet, quantity, discountedPrice, sizeSet, styleSet, brand);
            Product savedProduct = productRepository.save(product);
    }

   
    @GetMapping("/products")
    public ResponseEntity<List<Product>> getAllProducts() {
        List<Product> products = productRepository.findAll();

    
        return ResponseEntity.ok(products);
    }

    
    @GetMapping("/top-selling")
    public ResponseEntity<List<Map<String, Object>>> getTopSellingProducts() {
        
        List<Object[]> topSellingProducts = purchaseRepository.findTopSellingProducts().stream().limit(5).toList();
      
        List<Map<String, Object>> response = new ArrayList<>();
    
        for (Object[] result : topSellingProducts) {
            Long productId = (Long) result[0];
            Long totalQuantity = (Long) result[1];

            Optional<Product> productOpt = productRepository.findById(productId);
     
            List<Product> products = productOpt.isPresent() ? List.of(productOpt.get()) : List.of();
            for (Product product : products) {
              
                Map<String, Object> productMap = new HashMap<>();
                productMap.put("id", product.getId());
                productMap.put("name", product.getName());
                productMap.put("description", product.getDescription());
                productMap.put("tags", product.getTags());
                productMap.put("price", product.getPrice());
                productMap.put("quantity", totalQuantity); // Use total quantity sold
                productMap.put("colors", product.getColors());
                productMap.put("discountedPrice", product.getDiscountedPrice());
                productMap.put("salesCount", product.getSalesCount());
                productMap.put("sizes", product.getSizes());
                productMap.put("styles", product.getStyles());
                productMap.put("brand", product.getBrand());
                List<String> base64Images = new ArrayList<>();
                for (Image image : product.getImage()) {
                    base64Images.add(Base64.getEncoder().encodeToString(image.getimage()));
                }
                productMap.put("images", base64Images);

                response.add(productMap);
            }
        }

        return ResponseEntity.ok(response);
    }

    
}