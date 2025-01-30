package com.Prototype.StyloSphere.classes.WishList;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;


@Entity
@Table(name = "WishList")
public class WishListItem {

    @EmbeddedId
    private WishListId id;
    
    public WishListItem(Long productId, Long customerId) {
        this.id = new WishListId(productId, customerId);
    }
    public WishListItem(){
    }

    public WishListId getId() {
        return this.id;
    }

    public Long getProductId() {
        return this.id.getProductId();
    }

    public Long getCustomerId() {
        return this.id.getCustomerId();
    }
    
}
