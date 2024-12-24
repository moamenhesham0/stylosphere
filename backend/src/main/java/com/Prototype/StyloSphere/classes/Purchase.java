package com.Prototype.StyloSphere.classes;


import jakarta.persistence.Entity;

import jakarta.persistence.Table;
import java.util.*;

@Entity
@Table(name = "PurchaseHistory")
public class Purchase extends Order {
    
    private Long customerId;
    private Date timeStamp;
    
    public Purchase(Long givenCustomerId, Date givenTimeStamp , Long productId, String productColor, String productSize, int quantity) {
        super(productId, productColor, productSize, quantity);
        this.customerId = givenCustomerId;
        this.timeStamp = givenTimeStamp;
    }

    public void setCustomerId(Long givenCustomerId)
    {
        this.customerId = givenCustomerId;
    }
    public Long getCustomerId()
    {
        return this.customerId;
    }
   
    public Date getPurchaseDate()
    {
        return this.timeStamp;
    }

    
}
