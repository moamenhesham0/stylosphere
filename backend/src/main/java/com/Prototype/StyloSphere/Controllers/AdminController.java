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
            @RequestParam("images") MultipartFile[] images) {

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

            Product product = new Product(name, description, price, imageList, tagSet, colorSet, quantity);
            Product savedProduct = productRepository.save(product);
    }

   
    @GetMapping("/products")
    public ResponseEntity<List<Map<String, Object>>> getAllProducts() {
        List<Product> products = productRepository.findAll();
        List<Map<String, Object>> response = new ArrayList<>();
    
        for (Product product : products) {
            Map<String, Object> productMap = new HashMap<>();
            productMap.put("id", product.getId());
            productMap.put("name", product.getName());
            productMap.put("description", product.getDescription());
            productMap.put("tags", product.getTags());
            productMap.put("price", product.getPrice());
            productMap.put("quantity", product.getQuantity());
            productMap.put("colors", product.getColors());
    
            List<String> base64Images = new ArrayList<>();
            for (Image image : product.getImage()) {
                base64Images.add(Base64.getEncoder().encodeToString(image.getimage()));
            }
            productMap.put("images", base64Images);
    
            response.add(productMap);
        }
    
        return ResponseEntity.ok(response);
    }

    
    @GetMapping("/top-selling")
    public ResponseEntity<List<Map<String, Object>>> getTopSellingProducts() {
        System.out.println("Top selling productsssss");
        List<Object[]> topSellingProducts = purchaseRepository.findTopSellingProducts().stream().limit(5).toList();
        System.out.println(topSellingProducts.get(0).toString()+"nananana");
        List<Map<String, Object>> response = new ArrayList<>();
        System.out.println(response+"ffffffffffff");
        for (Object[] result : topSellingProducts) {
            Long productId = (Long) result[0];
            Long totalQuantity = (Long) result[1];

            Optional<Product> productOpt = productRepository.findById(productId);
            System.out.println(productId+"productIddddddddds");
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

                List<String> base64Images = new ArrayList<>();
                for (Image image : product.getImage()) {
                    base64Images.add(Base64.getEncoder().encodeToString(image.getimage()));
                }
                productMap.put("images", base64Images);

                response.add(productMap);
            }
        }
        System.out.println(response+"response");
        return ResponseEntity.ok(response);
    }

    
}