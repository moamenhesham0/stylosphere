package com.Prototype.StyloSphere.classes;

import jakarta.persistence.CascadeType;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;

import java.util.*;
import jakarta.persistence.Table;
@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    @Column(length = 5000)
    private String description;
    private Set<String> tags = new HashSet<>(); // Initialize tags with a HashSet
    private double price;
    private int quantity;
    private double DiscountedPrice;
    private int SalesCount;
    private Set<String> sizes = new HashSet<>();
    private Set<String> styles = new HashSet<>();
    private String brand;


    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "product_id")
    List<Image> images;

     // Store images as a list of byte arrays

    
    private Set<String> colors;

    
    public Product() {
    }
    public Product(String name, String description, double price, List<Image> images, Set<String> tags, Set<String> colors, int quantity, double discountedPrice, int salesCount, Set<String> sizes, Set<String> styles, String brand) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.images = images;
        this.tags = tags;
        this.colors = colors;
        this.quantity = quantity;
        this.DiscountedPrice = discountedPrice;
        this.SalesCount = salesCount;
        this.sizes = sizes;
        this.styles = styles;
        this.brand = brand;
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return this.description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getPrice() {
        return this.price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public List<Image> getImage() {
        return this.images;
    }

    public void setImage(List<Image> images) {
        this.images = images;
    }

    public void addTag(String tag) {
        this.tags.add(tag);
    }

    public Set<String> getTags() {
        return this.tags;
    }

    public Set<String> getColors()
    {
        return this.colors;
    }
    public void setColor(Set<String> colors)
    {
        this.colors = colors;
    }

    public void addColor(String colors)
    {
        this.colors.add(colors);
    }


    public void setQuantity(int quantity)
    {
        this.quantity = quantity;
    }
    public int getQuantity()
    {
        return this.quantity;
    }
    public void setDiscountedPrice(double discountedPrice)
    {
        this.DiscountedPrice = discountedPrice;
    }
    public double getDiscountedPrice()
    {
        return this.DiscountedPrice;
    }
    public void setSalesCount(int salesCount)
    {
        this.SalesCount = salesCount;
    }
    public int getSalesCount()
    {
        return this.SalesCount;
    }

    public Set<String> getSizes() {
        return sizes;
    }

    public void setSizes(Set<String> sizes) {
        this.sizes = sizes;
    }

    public Set<String> getStyles() {
        return styles;
    }

    public void setStyles(Set<String> styles) {
        this.styles = styles;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }
}
