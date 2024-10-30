package com.fpt.Graduation_Project_SEP490_NongSan.service.imp;

import com.fpt.Graduation_Project_SEP490_NongSan.repository.PriceMonitoringRepository;
import com.fpt.Graduation_Project_SEP490_NongSan.repository.SubcategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PriceMonitoringServiceImpl {

    @Autowired
    private PriceMonitoringRepository priceMonitoringRepository;

    @Autowired
    private SubcategoryRepository subcategoryRepository;
}
