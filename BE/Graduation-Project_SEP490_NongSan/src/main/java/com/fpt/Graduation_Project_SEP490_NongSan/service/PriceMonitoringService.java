package com.fpt.Graduation_Project_SEP490_NongSan.service;

import com.fpt.Graduation_Project_SEP490_NongSan.payload.response.PriceMonitoringResponse;

import java.util.List;

public interface PriceMonitoringService {

    List<PriceMonitoringResponse> getAllPriceMonitorings();

    List<PriceMonitoringResponse> getPriceMonitoringByIdSubcategory(int idSubcategory);
}
