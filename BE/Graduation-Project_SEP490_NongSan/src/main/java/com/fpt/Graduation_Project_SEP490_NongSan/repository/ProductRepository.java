package com.fpt.Graduation_Project_SEP490_NongSan.repository;

import com.fpt.Graduation_Project_SEP490_NongSan.modal.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {
    List<Product> findByCategoriesId(int idCategory);

    List<Product> findByNameContaining(String productName);
}
