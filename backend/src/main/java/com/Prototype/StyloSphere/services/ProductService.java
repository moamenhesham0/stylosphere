package com.Prototype.StyloSphere.services;

import com.Prototype.StyloSphere.classes.Product;
import com.Prototype.StyloSphere.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    // Create a new product
    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    // Get all products
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // Get a product by id
    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    // Update an existing product
    public Product updateProduct(Long id, Product updatedProduct) {
        if (productRepository.existsById(id)) {
            updatedProduct.setId(id);
            return productRepository.save(updatedProduct);
        }
        return null;
    }

    // Delete a product
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
}


