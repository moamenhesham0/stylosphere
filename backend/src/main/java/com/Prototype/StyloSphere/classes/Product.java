package com.Prototype.StyloSphere.classes;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;


import java.util.*;
import jakarta.persistence.Table;
@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private Set<String> tags = new HashSet<>(); // Initialize tags with a HashSet
    private double price;
    private byte[] image; // Store image as a byte array
    private String color;

    public Product() {
    }

    public Product(String name, String description, double price, byte[] image) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.image = image;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public byte[] getImage() {
        return image;
    }

    public void setImage(byte[] image) {
        this.image = image;
    }

    public void addTag(String tag) {
        this.tags.add(tag);
    }

    public Set<String> getTags() {
        return this.tags;
    }

    public String getColor()
    {
        return this.color;
    }
    public void setColor(String color)
    {
        this.color = color.toLowerCase();
    }
}


