package com.Prototype.StyloSphere.classes;


import java.util.List;



import jakarta.persistence.ElementCollection;
import jakarta.persistence.Embeddable;
@Embeddable
public class Cart {
    @ElementCollection
    List<Long> cartItems;


    public void clearCart()
    {
        this.cartItems.clear();
    }

    public void addProductToCart(Long orderId)
    {
        this.cartItems.add(orderId);
    }

    public void removeProductFromCart(Long orderId)
    {
        this.cartItems.remove(orderId);
    }

    public List<Long> getCartItems()
    {
        return this.cartItems;
    }

    public void setCartItems(List<Long> cartItems)
    {
        this.cartItems = cartItems;
    }
}
