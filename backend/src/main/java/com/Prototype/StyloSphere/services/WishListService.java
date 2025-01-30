package com.Prototype.StyloSphere.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.Prototype.StyloSphere.repositories.ProductRepository;
import com.Prototype.StyloSphere.repositories.WishListRepository;
import com.Prototype.StyloSphere.classes.*;
import com.Prototype.StyloSphere.classes.WishList.WishListId;
import com.Prototype.StyloSphere.classes.WishList.WishListItem;

import java.util.*;
@Service
public class WishListService {
    
    @Autowired
    private WishListRepository wishListRepository;

    @Autowired
    private ProductRepository productRepository;

    public List<Product> getWishListProducts(Long customerId)
    {   
        
        List<WishListItem> wishListIds = wishListRepository.findByIdCustomerId(customerId);
        List<Long> productIds = wishListIds.stream()
                                         .map(WishListItem::getProductId)
                                         .toList();
    
        List<Product> wishList = productRepository.findAllById(productIds);
        return wishList;
    }
    
    public void saveProductToWishList(Long customerId , Long productId)
    {
        WishListItem newWishListItem = new WishListItem(productId, customerId);
        wishListRepository.save(newWishListItem);
    }

    public void deleteProductFromWishList(Long customerId , Long productId)
    {
        WishListId wishListIdTarget = new WishListId(productId, customerId);
        wishListRepository.deleteById(wishListIdTarget);
    }
}
