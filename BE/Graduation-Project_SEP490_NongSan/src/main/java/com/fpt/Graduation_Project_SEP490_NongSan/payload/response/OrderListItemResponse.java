package com.fpt.Graduation_Project_SEP490_NongSan.payload.response;

import lombok.Data;

@Data
public class OrderListItemResponse {

    private int idItemProduct;

    private int idProductOrder;

    private int priceOrderProduct;

    private int quantityOrderProduct;

    private String productName;

    private String nameHouseholdProduct;



}