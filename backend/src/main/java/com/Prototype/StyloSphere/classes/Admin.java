package com.Prototype.StyloSphere.classes;


import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import java.util.List;

@Entity
@Table(name = "admins")
public class Admin extends User {
    private String adminLevel;

    public Admin() {
    }

    public Admin(String name, String email, String password, String adminLevel) {
        super(name, email, password);
        this.adminLevel = adminLevel;
    }

    public String getAdminLevel() {
        return adminLevel;
    }

    public void setAdminLevel(String adminLevel) {
        this.adminLevel = adminLevel;
    }

    @Override
    public String getRole() {
        return "Admin";
    }

    // Method to add another admin
    public Admin addAdmin(String name, String email, String password, String adminLevel) {
        System.out.println("Adding a new admin: " + name);
        return new Admin(name, email, password, adminLevel); // Save this in a repository in the service layer
    }

    // Method to add a product
    public void addProduct(Product product, List<Product> productList) {
        productList.add(product);
        System.out.println("Product added: " + product.getName());
    }

    // Method to delete a product
    public void deleteProduct(Product product, List<Product> productList) {
        if (productList.contains(product)) {
            productList.remove(product);
            System.out.println("Product deleted: " + product.getName());
        } else {
            System.out.println("Product not found: " + product.getName());
        }
    }

    // Method to respond to compliments
    public void respondToCompliment(String compliment) {
        System.out.println("Admin Response: Thank you for the compliment! We're happy to assist you.");
    }
}
