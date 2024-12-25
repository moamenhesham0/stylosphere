package com.Prototype.StyloSphere.classes.Messages;




import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
@Entity
@DiscriminatorValue("Comment")
public class Comment extends Message {
    private Long productId;

    public Comment(Long productId , String message , Long sender) {
        super(message, sender);
        this.productId = productId;
    }
    public Comment() {
    }
    public Long getProductId() {
        return productId;
    }
    public void setProductId(Long productId) {
        this.productId = productId;
    }

    
}
