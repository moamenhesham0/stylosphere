package com.Prototype.StyloSphere.classes.Messages;

import java.sql.Date;


import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
@Entity
@DiscriminatorValue("Comment")
public class Comment extends Message {
    private Long productId;

    public Comment(Long productId , String message , String sender , Date timeStamp) {
        super(message, sender);
        this.productId = productId;
    }

    public Long getProductId() {
        return productId;
    }
    public void setProductId(Long productId) {
        this.productId = productId;
    }

    
}
