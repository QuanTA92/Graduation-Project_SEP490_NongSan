package com.fpt.Graduation_Project_SEP490_NongSan.service.imp;

import com.fpt.Graduation_Project_SEP490_NongSan.modal.PriceMonitoring;
import com.fpt.Graduation_Project_SEP490_NongSan.modal.Subcategory;
import com.fpt.Graduation_Project_SEP490_NongSan.payload.response.PriceMonitoringResponse;
import com.fpt.Graduation_Project_SEP490_NongSan.repository.PriceMonitoringRepository;
import com.fpt.Graduation_Project_SEP490_NongSan.repository.SubcategoryRepository;
import com.fpt.Graduation_Project_SEP490_NongSan.service.PriceMonitoringService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PriceMonitoringServiceImpl implements PriceMonitoringService {

    @Autowired
    private PriceMonitoringRepository priceMonitoringRepository;

    @Autowired
    private SubcategoryRepository subcategoryRepository;

    @Override
    public List<PriceMonitoringResponse> getAllPriceMonitorings() {
        List<PriceMonitoring> priceMonitorings = priceMonitoringRepository.findAll();
        return priceMonitorings.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    // Lấy các bản ghi PriceMonitoring theo idSubcategory và chuyển đổi sang DTO
    @Override
    public List<PriceMonitoringResponse> getPriceMonitoringByIdSubcategory(int idSubcategory) {
        List<PriceMonitoring> priceMonitorings = priceMonitoringRepository.findBySubcategoryId(idSubcategory);
        return priceMonitorings.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    // Phương thức chuyển đổi từ PriceMonitoring sang PriceMonitoringResponse
    private PriceMonitoringResponse convertToDto(PriceMonitoring priceMonitoring) {
        PriceMonitoringResponse response = new PriceMonitoringResponse();
        response.setIdSubcategory(priceMonitoring.getSubcategory().getId());
        response.setNameSubcategory(priceMonitoring.getSubcategory().getName());
        response.setMaxPrice((int) priceMonitoring.getMaxPrice());
        response.setMinPrice((int) priceMonitoring.getMinPrice());
        return response;
    }
}
