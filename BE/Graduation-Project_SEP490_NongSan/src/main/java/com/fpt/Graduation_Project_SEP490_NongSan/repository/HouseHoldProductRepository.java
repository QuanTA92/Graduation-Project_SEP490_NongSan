package com.fpt.Graduation_Project_SEP490_NongSan.repository;

import com.fpt.Graduation_Project_SEP490_NongSan.modal.HouseHoldProduct;
import com.fpt.Graduation_Project_SEP490_NongSan.modal.Subcategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HouseHoldProductRepository extends JpaRepository<HouseHoldProduct, Integer> {

    HouseHoldProduct findByProductId(Long id);

    void deleteByProductId(int idProduct);

    List<HouseHoldProduct> findByPriceBetween(double minPrice, double maxPrice);

    List<HouseHoldProduct> findByUserId(int idHouseHold);

    List<HouseHoldProduct> findByProductSubcategory(Subcategory subcategory);
}
