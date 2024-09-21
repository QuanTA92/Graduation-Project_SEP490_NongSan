package com.fpt.Graduation_Project_SEP490_NongSan.payload.response;

import lombok.Data;

import java.util.List;

@Data
public class ProductResponse {

    public String idProduct;

    public String nameProduct;

    public String descriptionProduct;

    public String priceProduct;

    private List<String> imageProducts;

    public int quantityProduct;

    public String statusProduct;

    public String nameHouseHold;

    public String expirationDate;

    public String nameCategories;

    public String qualityCheck;
}
