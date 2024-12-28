package com.Prototype.StyloSphere.services;
import com.Prototype.StyloSphere.classes.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;
import com.Prototype.StyloSphere.repositories.ProductRepository;
@Service
public class ProductService {


    @Autowired
    private ProductRepository productRepository;
    
    public void saveProduct(Product product)
    {
        productRepository.save(product);
    }
    public List<Product> getBaseList()
    {
        return productRepository.findAll();
    }
    public Product getProductById(Long id)
    {
        return productRepository.getReferenceById(id);
    }

    public List<Product> filterByTags (List<String> tags , List<Product> products)
    {
        List<Product> filteProducts = new ArrayList<>();
        for(Product product : products)
        {
            final Set<String> productTags = product.getTags();
            boolean valid = true;
            for(String tag : tags)
            {
                final String capitalized = tag.substring(0, 1).toUpperCase() + tag.substring(1).toLowerCase();
                valid = productTags.contains(tag) || 
                        productTags.contains(tag.toLowerCase()) || 
                        productTags.contains(capitalized) ||
                        productTags.contains(tag.toUpperCase());

                if(!valid)
                    break;
            }

            if(valid) filteProducts.add(product);
        }


        return filteProducts;
    }


    public List<Product> filterByColor (List<String> colors , List<Product> products)
    {
        List<Product> filteProducts = new ArrayList<>();
        for(Product product : products)
        {
            final Set<String> productColor = product.getColors();
            boolean valid = true;

            for(String color : colors)
            {
                final String capitalized = color.substring(0, 1).toUpperCase() + color.substring(1).toLowerCase();
                valid = productColor.contains(color) || 
                productColor.contains(color.toLowerCase()) ||
                productColor.contains(capitalized) ||
                productColor.contains(color.toUpperCase());

            if(valid){
                filteProducts.add(product);
                break;
            }
        }
        }

        return filteProducts;
    }
    public List<Product> getTopBestSellers(int limit) {
        List<Product> allProducts = productRepository.findAll();
        allProducts.sort((p1, p2) -> Integer.compare(p2.getSalesCount(), p1.getSalesCount()));
        return allProducts.stream().limit(limit).toList();
    }
    
    public List<Product> getDiscountedProducts() {
        return productRepository.findAll().stream()
                .filter(product -> product.getDiscountedPrice() < product.getPrice())
                .toList();
    }
    



    public List<Product> search (String query)
    {
        List<Product> products = productRepository.findAll();
        List<Product> filteProducts = new ArrayList<>();
        for(Product product : products)
        {
            boolean addProduct = false ||
            product.getName().contains(query)        || (query).contains(product.getName()) ||
            product.getDescription().contains(query) || (query).contains(product.getDescription()) ||
            product.getTags().contains(query)        || (query).contains(product.getTags().toString()) ||
            product.getColors().contains(query)      || (query).contains(product.getColors().toString());

            if(addProduct)
                filteProducts.add(product);
        }
        return filteProducts;
    }

    
}
