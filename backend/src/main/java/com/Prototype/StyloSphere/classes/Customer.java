package com.Prototype.StyloSphere.classes;



import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;


import java.util.List;

@Entity
@DiscriminatorValue("Customer")
public class Customer extends User {
    private String shippingAddress;
    private String phoneNumber;
    private String paymentMethod;
    
    

    private List<Long> purchaseHistory;

    public Customer(String name, String email, String password, String shippingAddress, String paymentMethod) {
        super(name, email, password);
        this.shippingAddress = shippingAddress;
        this.paymentMethod = paymentMethod;
    }
    public Customer() {
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

    public String getPhoneNumber() {
        return this.phoneNumber;
    }
    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    } 

    public List<Long> getPurchaseHistory()
    {
        return this.purchaseHistory;
    }
    
}