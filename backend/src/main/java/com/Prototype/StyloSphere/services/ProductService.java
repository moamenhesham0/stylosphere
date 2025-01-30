package com.Prototype.StyloSphere.services;
import com.Prototype.StyloSphere.classes.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

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
        Optional<Product> product = productRepository.findById(id);
        return product.orElse(null);
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

                        if(valid){
                            filteProducts.add(product);
                            break;
                        }
            }

         
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
        return productRepository.search(query);
    }
    
    public List<Product> filterByMaxPrice(double maxPrice, List<Product> products) {
        return products.stream()
                       .filter(product -> product.getPrice() <= maxPrice)
                       .collect(Collectors.toList());
    }
    
    public List<Product> filterBySize(List<String> sizes, List<Product> products) {
        List<Product> filteredProducts = new ArrayList<>();
        for (Product product : products) {
            final Set<String> productSizes = product.getSizes();
            boolean valid = true;
    
            for (String size : sizes) {
                final String capitalized = size.substring(0, 1).toUpperCase() + size.substring(1).toLowerCase();
                valid = productSizes.contains(size) || 
                        productSizes.contains(size.toLowerCase()) ||
                        productSizes.contains(capitalized) ||
                        productSizes.contains(size.toUpperCase());
    
                if (valid) {
                    filteredProducts.add(product);
                    break;
                }
            }
        }
        return filteredProducts;
    }

    public List<Product> filterByStyle(List<String> styles, List<Product> products) {
        List<Product> filteredProducts = new ArrayList<>();
        for (Product product : products) {
            final Set<String> productStyles = product.getStyles();
            boolean valid = true;
    
            for (String style : styles) {
                final String capitalized = style.substring(0, 1).toUpperCase() + style.substring(1).toLowerCase();
                valid = productStyles.contains(style) || 
                        productStyles.contains(style.toLowerCase()) ||
                        productStyles.contains(capitalized) ||
                        productStyles.contains(style.toUpperCase());
    
                if (valid) {
                    filteredProducts.add(product);
                    break;
                }
            }
        }
        return filteredProducts;
    }
    public List<Product> filterByBrand(List<String> brands, List<Product> products) {
        List<Product> filteredProducts = new ArrayList<>();
        for (Product product : products) {
            final String productBrand = product.getBrand();
            boolean valid = true;
    
            for (String brand : brands) {
                final String capitalized = brand.substring(0, 1).toUpperCase() + brand.substring(1).toLowerCase();
                valid = productBrand.equals(brand) || 
                        productBrand.equalsIgnoreCase(brand) ||
                        productBrand.equals(capitalized) ||
                        productBrand.equals(brand.toUpperCase());
    
                if (valid) {
                    filteredProducts.add(product);
                    break;
                }
            }
        }
        return filteredProducts;
    }
    public  boolean matchesTags(List<String> tags, Product product) {
        if (tags == null || tags.isEmpty()) {
            return true; // No tags specified, no filtering required
        }
        Set<String> productTags = product.getTags();
        return tags.stream().anyMatch(tag -> productTags.contains(tag.toLowerCase()) ||
                                             productTags.contains(tag.toUpperCase()) ||
                                             productTags.contains(capitalize(tag)));
    }

    public  boolean matchesColors(List<String> colors, Product product) {
        if (colors == null || colors.isEmpty()) {
            return true; // No colors specified, no filtering required
        }
        Set<String> productColors = product.getColors();
        return colors.stream().anyMatch(color -> productColors.contains(color.toLowerCase()) ||
                                                 productColors.contains(color.toUpperCase()) ||
                                                 productColors.contains(capitalize(color)));
    }

    public  boolean matchesSizes(List<String> sizes, Product product) {
        if (sizes == null || sizes.isEmpty()) {
            return true; // No sizes specified, no filtering required
        }
        Set<String> productSizes = product.getSizes();
        return sizes.stream().anyMatch(size -> productSizes.contains(size.toLowerCase()) ||
                                               productSizes.contains(size.toUpperCase()) ||
                                               productSizes.contains(capitalize(size)));
    }

    public  boolean matchesStyles(List<String> styles, Product product) {
        if (styles == null || styles.isEmpty()) {
            return true; // No styles specified, no filtering required
        }
        Set<String> productStyles = product.getStyles();
        return styles.stream().anyMatch(style -> productStyles.contains(style.toLowerCase()) ||
                                                 productStyles.contains(style.toUpperCase()) ||
                                                 productStyles.contains(capitalize(style)));
    }

    public  boolean matchesBrands(List<String> brands, Product product) {
        if (brands == null || brands.isEmpty()) {
            return true; // No brands specified, no filtering required
        }
        String productBrand = product.getBrand();
        return brands.stream().anyMatch(brand -> productBrand.equalsIgnoreCase(brand) ||
                                                 productBrand.equals(capitalize(brand)));
    }

    private  String capitalize(String input) {
        if (input == null || input.isEmpty()) {
            return input;
        }
        return input.substring(0, 1).toUpperCase() + input.substring(1).toLowerCase();
    }
                        
}
