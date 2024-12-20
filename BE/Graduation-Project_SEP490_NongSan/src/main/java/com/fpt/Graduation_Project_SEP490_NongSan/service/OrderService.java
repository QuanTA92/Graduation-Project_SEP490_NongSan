package com.fpt.Graduation_Project_SEP490_NongSan.service;

import com.fpt.Graduation_Project_SEP490_NongSan.payload.request.StatusRequest;
import com.fpt.Graduation_Project_SEP490_NongSan.payload.request.WithdrawalRequest;
import com.fpt.Graduation_Project_SEP490_NongSan.payload.response.OrderListItemResponse;
import com.fpt.Graduation_Project_SEP490_NongSan.payload.response.OrdersResponse;

import java.util.List;
import java.util.Map;

public interface OrderService {

    List<OrdersResponse> getAllOrdersForTrader(String jwt);

    List<OrdersResponse> getOrdersByIdOrderForTrader(String jwt, int idOrder);

    List<OrdersResponse> getOrdersByNameHouseHoldForTrader(String jwt, String nameHousehold);

    List<OrdersResponse> getOrdersByNameProductForTrader(String jwt, String nameProduct);

    boolean updateOrderStatusForTrader(String jwt, StatusRequest statusRequest);

    boolean updateOrderStatusForHouseHold(String jwt, StatusRequest statusRequest);

    boolean updateOrderWithdrawalRequestForHouseHold(String jwt, WithdrawalRequest withdrawalRequest);

    boolean updateOrderWithdrawalRequestForAdmin(WithdrawalRequest withdrawalRequest);

    List<OrderListItemResponse> getOrderWithdrawalRequestForHousehold(String jwt);

    List<OrderListItemResponse> getOrderWithdrawalRequestForAdmin();

    List<OrdersResponse> getAllOrdersForAdmin(int totalAdminCommission);

    List<OrdersResponse> getOrdersByIdOrderForAdmin(int idOrder);

    List<OrdersResponse> getOrdersByNameHouseForAdmin(String nameHousehold);

    List<OrdersResponse> getOrdersByNameProductForAdmin(String nameProduct);

    Map<String, Object> getAllOrdersForHouseHold(String jwt);

    List<OrdersResponse> getOrdersByIdOrderForHouseHold(String jwt, int idOrder);

    Map<String, Object> getOrdersByIdProductForHouseHold(String jwt, int idProduct, int totalRevenueProduct);

    Map<String, Object> getOrdersByNameProductForHouseHold(String jwt, String nameProduct, int totalRevenueProduct);

}
