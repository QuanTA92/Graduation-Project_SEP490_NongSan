package com.fpt.Graduation_Project_SEP490_NongSan.payload.response;

import lombok.Data;

import java.util.List;

@Data
public class ProductResponse {

    private String idProduct;

    private String nameProduct;

    private String descriptionProduct;

    private String priceProduct;

    private List<String> imageProducts;

    private int quantityProduct;

    private String statusProduct;

    private String nameHouseHold;

    private String expirationDate;

    private String nameSubcategory;

    private String qualityCheck;

    private String specificAddressProduct;

    private String wardProduct;

    private String districtProduct;

    private String cityProduct;
}
