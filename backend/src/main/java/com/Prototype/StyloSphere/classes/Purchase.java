package com.Prototype.StyloSphere.classes;


import jakarta.persistence.*;

import jakarta.persistence.Table;

import java.time.LocalDate;

@Entity
@Table(name = "PurchaseHistory")
public class Purchase extends Order {
    
    private Long customerId;
    private LocalDate timeStamp;
    
    public Purchase(Long givenCustomerId, Long productId, String productColor, String productSize, int quantity) {
        super(productId, productColor, productSize, quantity);
        this.customerId = givenCustomerId;
        this.timeStamp = LocalDate.now();
    }
    public Purchase(){
    }
    public void setCustomerId(Long givenCustomerId)
    {
        this.customerId = givenCustomerId;
    }
    public Long getCustomerId()
    {
        return this.customerId;
    }
   
    public LocalDate getPurchaseDate()
    {
        return this.timeStamp;
    }

    
}
