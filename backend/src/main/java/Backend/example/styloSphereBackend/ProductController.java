package Backend.example.styloSphereBackend.controller;

import Backend.example.styloSphereBackend.model.Product;
import Backend.example.styloSphereBackend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class ProductController {

    private ProductRepository productRepository;
    @Autowired
    public ProductController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }
    // Endpoint to get all products
    @GetMapping("/api/products")
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // Endpoint to get a single product by its ID
    @GetMapping("/api/products/{id}")
    public Product getProductById(@PathVariable Long id) {
        return productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
    }
}


