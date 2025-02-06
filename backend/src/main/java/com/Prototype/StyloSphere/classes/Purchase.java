package com.Prototype.StyloSphere.classes;


import jakarta.persistence.*;
import java.util.Date;
@Entity
@Table(name = "PurchaseHistory")
public class Purchase extends Order {
    
    private Date timeStamp;
    private String shipmentStatus = "PENDING";

    
    public Purchase(Long givenCustomerId, Long productId, String productColor, String productSize, int quantity) {
        super(productId, givenCustomerId, productColor, productSize, quantity);
        this.timeStamp = new Date();
    }
    public Purchase(){
    }
   
    public Date getPurchaseDate()
    {
        return this.timeStamp;
    }

    public String getShipmentStatus() {
        return shipmentStatus;
    }

    public void setShipmentStatus(String shipmentStatus) {
        this.shipmentStatus = shipmentStatus;
    }

}
