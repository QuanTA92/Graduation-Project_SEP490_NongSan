package com.fpt.Graduation_Project_SEP490_NongSan.payload.response;

import lombok.Data;

import java.util.Date;

@Data
public class DashboardHouseHoldResponse {

    private int totalRevenue;

    // Cac san pham dang ban
    private int currentProductsForSale;

    // Tổng số lượng các sản phẩm đang bán.
    private int totalQuantityOfProductsCurrentlyForSale;

    // Các sản phẩm đã bán hết.
    private int soldOutProducts;

    private Date createDate;
}
