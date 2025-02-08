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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

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
public ResponseEntity<List<Product>> filterProducts(@RequestBody Map<String, List<String>> body, @RequestParam(required = false) Double maxPrice) {
    try {
        // Extract filter parameters from request body
        List<String> tags = body.get("selectedTags");
        List<String> colors = body.get("selectedColors");
        List<String> sizes = body.get("selectedSizes");
        List<String> styles = body.get("selectedStyles");
        List<String> brands = body.get("selectedBrands");

        // Retrieve the base product list
        List<Product> baseList = productService.getBaseList();

        // Apply filters using AND logic
        Stream<Product> productStream = baseList.stream();

        if (tags != null) {
            productStream = productStream.filter(product -> productService.matchesTags(tags, product));
        }
        if (colors != null) {
            productStream = productStream.filter(product -> productService.matchesColors(colors, product));
        }
        if (sizes != null) {
            productStream = productStream.filter(product -> productService.matchesSizes(sizes, product));
        }
        if (styles != null) {
            productStream = productStream.filter(product -> productService.matchesStyles(styles, product));
        }
        if (brands != null) {
            productStream = productStream.filter(product -> productService.matchesBrands(brands, product));
        }
        if (maxPrice != null) {
            productStream = productStream.filter(product -> product.getPrice() <= maxPrice);
        }

        List<Product> filteredProducts = productStream.collect(Collectors.toList());

        return ResponseEntity.ok(filteredProducts);
    } catch (Exception e) {
        // Handle errors gracefully
        return ResponseEntity.badRequest().body(new ArrayList<>());
    }
}

    
    @GetMapping("/best-sellers")
    public ResponseEntity<List<Product>> getBestSellers() {
        try {
            List<Product> bestSellers = productService.getTopBestSellers(10); // Top 5
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
    
    @GetMapping("/search")
    public ResponseEntity<List<Product>> search(@RequestParam String query) {
        try {
            List<Product> searchResults = productService.search(query);

            return ResponseEntity.ok(searchResults);
        } catch (Exception e) {

            return ResponseEntity.badRequest().body(new ArrayList<>());
        }
    }

       
    @GetMapping("/get-product")
    public ResponseEntity<Product> getProduct(@RequestParam Long id)
    {
        Product product = productService.getProductById(id);
        return ResponseEntity.ok(productService.getProductById(id));
    }

}
