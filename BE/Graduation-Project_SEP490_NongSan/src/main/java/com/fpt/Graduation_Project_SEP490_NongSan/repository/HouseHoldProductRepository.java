package com.fpt.Graduation_Project_SEP490_NongSan.repository;

import com.fpt.Graduation_Project_SEP490_NongSan.modal.HouseHoldProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HouseHoldProductRepository extends JpaRepository<HouseHoldProduct, Integer> {

    HouseHoldProduct findByProductId(Long id);

    void deleteByProductId(long idProduct);

    List<HouseHoldProduct> findByPriceBetween(double minPrice, double maxPrice);

    List<HouseHoldProduct> findByHouseHoldRoleId(int idHouseHold);
}
