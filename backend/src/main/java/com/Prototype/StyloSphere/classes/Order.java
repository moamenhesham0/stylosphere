package com.Prototype.StyloSphere.classes;


import jakarta.persistence.*;

@MappedSuperclass
public class Order{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long productId;
    private String productColor;
    private String productSize;
    private int quantity;

    public Order(Long productId, String productColor, String productSize, int quantity) {
        this.productId = productId;
        this.productColor = productColor;
        this.productSize = productSize;
        this.quantity = quantity;
    }

    public Long getId() {
        return this.id;
    }
    
    public Long getProductId() {
        return this.productId;
    }
    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getProductColor() {
        return this.productColor;
    }
    public void setProductColor(String productColor) {
        this.productColor = productColor;
    }

    public String getProductSize() {
        return this.productSize;
    }
    public void setProductSize(String productSize) {
        this.productSize = productSize;
    }

    public int getQuantity() {
        return this.quantity;
    }
    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
}
