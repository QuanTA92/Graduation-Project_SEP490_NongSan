package com.fpt.Graduation_Project_SEP490_NongSan.repository;

import com.fpt.Graduation_Project_SEP490_NongSan.modal.OrderItem;
import com.fpt.Graduation_Project_SEP490_NongSan.modal.Orders;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Integer> {

    List<OrderItem> findByProductId(Long id);

    List<OrderItem> findByOrders(Orders order);

    List<OrderItem> findByWithdrawalRequest(String withdrawalRequest);
}
