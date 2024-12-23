package com.fpt.Graduation_Project_SEP490_NongSan.repository;

import com.fpt.Graduation_Project_SEP490_NongSan.modal.Product;
import com.fpt.Graduation_Project_SEP490_NongSan.modal.Subcategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {

    List<Product> findByNameContaining(String productName);

    List<Product> findBySubcategoryId(int idSubcategory);

    List<Product> findBySubcategoryIdAndQuantityGreaterThanEqual(int idSubcategory, int quantity);

    List<Product> findBySubcategory_CategoryId(int idCategory);

    int countByQuantityGreaterThan(int i);


    //household
}
