package com.Prototype.StyloSphere.classes;



import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;

import java.util.List;

@Entity
@DiscriminatorValue("Customer")
public class Customer extends User {
    private String shippingAddress;
    private String paymentMethod;
    @OneToMany
    private List<Product> purchaseHistory;
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

    public List<Product> getPurchaseHistory()
    {
        return this.purchaseHistory;
    }
    public void addPurchaseEvent(Product  purchase)
    {
        this.purchaseHistory.add(purchase);
    }
    
}