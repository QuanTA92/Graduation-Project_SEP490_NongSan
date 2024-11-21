package com.fpt.Graduation_Project_SEP490_NongSan.service;

import com.fpt.Graduation_Project_SEP490_NongSan.payload.request.StatusRequest;
import com.fpt.Graduation_Project_SEP490_NongSan.payload.response.OrdersResponse;

import java.util.List;

public interface OrderService {

    List<OrdersResponse> getAllOrdersForTrader(String jwt);

    List<OrdersResponse> getOrdersByIdOrderForTrader(String jwt, int idOrder);

    List<OrdersResponse> getOrdersByNameHouseHoldForTrader(String jwt, String nameHousehold);

    List<OrdersResponse> getOrdersByNameProductForTrader(String jwt, String nameProduct);

    boolean updateOrderStatusForTrader(String jwt, StatusRequest statusRequest);

    boolean updateOrderStatusForHouseHold(String jwt, StatusRequest statusRequest);

    List<OrdersResponse> getAllOrdersForAdmin(int totalAdminCommission);

    List<OrdersResponse> getOrdersByIdOrderForAdmin(int idOrder);

    List<OrdersResponse> getAllOrdersForHouseHold(String jwt, int totalRevenue);

    List<OrdersResponse> getOrdersByIdOrderForHouseHold(String jwt, int idOrder);

    List<OrdersResponse> getOrdersByIdProductForHouseHold(String jwt, int idProduct, int totalRevenueProduct);
}
