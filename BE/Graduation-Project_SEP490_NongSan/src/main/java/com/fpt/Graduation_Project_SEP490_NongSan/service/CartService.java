package com.fpt.Graduation_Project_SEP490_NongSan.service;

import com.fpt.Graduation_Project_SEP490_NongSan.modal.Cart;
import com.fpt.Graduation_Project_SEP490_NongSan.payload.request.CartRequest;
import com.fpt.Graduation_Project_SEP490_NongSan.payload.response.CartResponse;

import java.util.List;

public interface CartService {

    boolean addCart(CartRequest cartRequest);

    boolean updateCart(int idCart, CartRequest cartRequest);

    boolean removeCart(int idCart);

    List<CartResponse> getAllItemInCarts(String jwt);

    List<CartResponse> getCartByIdCart(String jwt, int idCart);
}
