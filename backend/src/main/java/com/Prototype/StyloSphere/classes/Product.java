package com.Prototype.StyloSphere.classes;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;

import java.util.*;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
@AllArgsConstructor
@NoArgsConstructor
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
    private int quantity ;




   
    @Lob
    private List<String> images; // Store images as a list of byte arrays

    
    private List<String> colors;

    


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

    public List<String> getImage() {
        return this.images;
    }

    public void setImage(List<String> images) {
        this.images = images;
    }

    public void addTag(String tag) {
        this.tags.add(tag);
    }

    public Set<String> getTags() {
        return this.tags;
    }

    public List<String> getColor()
    {
        return this.colors;
    }
    public void setColor(List<String> colors)
    {
        this.colors = colors;
    }


    public void setQuantity(int quantity)
    {
        this.quantity = quantity;
    }
    public int getQuantity()
    {
        return this.quantity;
    }
}


