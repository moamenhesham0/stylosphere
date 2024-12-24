package com.Prototype.StyloSphere.classes;



import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;


import java.util.List;

@Entity
@DiscriminatorValue("Customer")
public class Customer extends User {
    private String shippingAddress;
    private String paymentMethod;

    @Embedded
    private Cart cart;

    private List<Long> purchaseHistory;

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

    public Cart getCart()
    {
        return this.cart;
    }
    public void setCart(Cart cart)
    {
        this.cart = cart;
    }

    public List<Long> getPurchaseHistory()
    {
        return this.purchaseHistory;
    }
    
}