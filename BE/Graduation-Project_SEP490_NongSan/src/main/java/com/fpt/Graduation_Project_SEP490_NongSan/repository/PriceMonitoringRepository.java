package com.fpt.Graduation_Project_SEP490_NongSan.repository;

import com.fpt.Graduation_Project_SEP490_NongSan.modal.PriceMonitoring;
import com.fpt.Graduation_Project_SEP490_NongSan.modal.Subcategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PriceMonitoringRepository extends JpaRepository<PriceMonitoring, Integer> {

    PriceMonitoring findBySubcategory(Subcategory subcategory);


    List<PriceMonitoring> findBySubcategoryId(int idSubcategory);
}
