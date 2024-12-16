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
            boolean addProduct = true;

            for(String tag : tags)
            {
                if(!productTags.contains(tag))
                {
                    addProduct = false;
                    break;
                }
            }

            if(addProduct) filteProducts.add(product);
        }


        return filteProducts;
    }


    public List<Product> filterByColor (List<String> colors , List<Product> products)
    {
        List<Product> filteProducts = new ArrayList<>();
        for(Product product : products)
        {
            final Set<String> productTags = product.getTags();
            boolean addProduct = true;

            for(String color : colors)
            {
                if(!productTags.contains(color))
                {
                    addProduct = false;
                    break;
                }
            }
            
            if(addProduct) filteProducts.add(product);
        }


        return filteProducts;
    }



}
