package com.Prototype.StyloSphere.classes.WishList;
import jakarta.persistence.Embeddable;
import java.io.Serializable;


@Embeddable
public class WishListId implements Serializable  {


    Long productId;
    Long customerId;

    public WishListId(Long productId, Long customerId) {
        this.productId = productId;
        this.customerId = customerId;
    }
    public WishListId(){
    }

    public Long getProductId() {
        return this.productId;
    }

    public Long getCustomerId() {
        return this.customerId;
    }
}
