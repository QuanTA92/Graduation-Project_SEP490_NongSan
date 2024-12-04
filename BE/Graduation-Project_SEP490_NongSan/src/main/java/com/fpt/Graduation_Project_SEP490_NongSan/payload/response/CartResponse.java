package com.fpt.Graduation_Project_SEP490_NongSan.payload.response;

import lombok.Data;

@Data
public class CartResponse {

    private int idCart;

    private int idHouseHold;

    private int idProduct;

    private String nameProduct;

    private String nameHouseHold;

    private int quantity;

    private String quantityStatus;

    private int price;

    private String firstImage;

    private String nameSubcategoryProduct;

    private String addressProduct;

    private String wardProduct;

    private String districtProduct;

    private String cityProduct;

}
