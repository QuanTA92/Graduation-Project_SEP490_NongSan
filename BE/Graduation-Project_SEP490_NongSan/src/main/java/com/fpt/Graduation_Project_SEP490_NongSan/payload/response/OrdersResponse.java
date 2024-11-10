package com.fpt.Graduation_Project_SEP490_NongSan.payload.response;

import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class OrdersResponse {

    private int idOrderProduct;

    private String nameTraderOrder;

    private int amountPaidOrderProduct;

    private int adminCommissionOrderProduct;

    private String statusOrderProduct;

    private String transferContentOrderProduct;

    private List<OrderListItemResponse> orderItems;

    private Date createDate;

}
