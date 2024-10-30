package com.fpt.Graduation_Project_SEP490_NongSan.payload.request;

import lombok.Data;

@Data
public class CartRequest {

    private int idUser;

    private int idProduct;

    private int quantity;
}
