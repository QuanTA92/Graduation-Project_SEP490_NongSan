package com.fpt.Graduation_Project_SEP490_NongSan.repository;

import com.fpt.Graduation_Project_SEP490_NongSan.modal.Cart;
import com.fpt.Graduation_Project_SEP490_NongSan.modal.Product;
import com.fpt.Graduation_Project_SEP490_NongSan.modal.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Integer> {

    Cart findByUserAndProduct(User user, Product product);

    List<Cart> findByUser(User user);

    List<Cart> findByIdInAndUser(List<Integer> idCartList, User user);
}
