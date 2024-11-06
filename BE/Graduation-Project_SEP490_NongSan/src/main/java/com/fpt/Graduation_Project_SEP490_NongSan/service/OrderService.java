package com.fpt.Graduation_Project_SEP490_NongSan.service;

import com.fpt.Graduation_Project_SEP490_NongSan.payload.response.OrdersResponse;

import java.util.List;

public interface OrderService {

    List<OrdersResponse> getAllOrders(String jwt);

    List<OrdersResponse> getOrdersByIdOrder(String jwt, int idOrder);

    List<OrdersResponse> getOrdersByNameHouseHold(String jwt, String nameHousehold);

    List<OrdersResponse> getOrdersByNameProduct(String jwt, String nameProduct);
}
