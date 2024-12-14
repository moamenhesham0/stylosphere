package com.Prototype.StyloSphere.classes;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "customers")
public class Customer extends User {
    private String shippingAddress;
    private String paymentMethod;

    public Customer() {
    }

    public Customer(String name, String email, String password, String shippingAddress, String paymentMethod) {
        super(name, email, password);
        this.shippingAddress = shippingAddress;
        this.paymentMethod = paymentMethod;
    }

    public String getShippingAddress() {
        return shippingAddress;
    }

    public void setShippingAddress(String shippingAddress) {
        this.shippingAddress = shippingAddress;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    @Override
    public String getRole() {
        return "Customer";
    }
    @Override
    public String toString() {
        return "{" +
               "name:" + this.getName() + "," +
               "email:" + this.getEmail() + "," +
               "address:," +
               "phone:," +
               "mobile:," +
               "cart:{}" +
               "}";
    }

    // Method to log in
    public boolean logIn(String email, String password) {
        // This is just a placeholder. In a real application, you'd query the database.
        if (this.getEmail().equals(email) && this.getPassword().equals(password)) {
            System.out.println("Login successful!");
            return true;
        }
        System.out.println("Login failed!");
        return false;
    }

    // Method to place an order
    public void placeOrder(Order order) {
        System.out.println("Order placed: " + order.getOrderDetails());
        // Save the order to the database in the service layer.
    }

    // Method to check out
    public void checkOut() {
        System.out.println("Checking out with payment method: " + paymentMethod);
        // Implement checkout logic, like reducing inventory and processing payment.
    }

    // Method to search for products
    public void searchProduct(String keyword, List<Product> productList) {
        System.out.println("Searching for products with keyword: " + keyword);
        productList.stream()
                .filter(product -> product.getName().toLowerCase().contains(keyword.toLowerCase()))
                .forEach(product -> System.out.println("Found: " + product.getName()));
    }
}