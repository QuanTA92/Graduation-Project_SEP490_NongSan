package com.fpt.Graduation_Project_SEP490_NongSan.repository;

import com.fpt.Graduation_Project_SEP490_NongSan.modal.Orders;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrdersRepository extends JpaRepository<Orders, Integer> {

    List<Orders> findByUserId(int userId);

    // Find orders by user ID and order ID
    List<Orders> findByUserIdAndId(int userId, int idOrder);
}
