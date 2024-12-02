package com.fpt.Graduation_Project_SEP490_NongSan.controller;

import com.fpt.Graduation_Project_SEP490_NongSan.payload.response.PriceMonitoringResponse;
import com.fpt.Graduation_Project_SEP490_NongSan.service.PriceMonitoringService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("api/priceMonitoring")
public class PriceMonitoringController {

    @Autowired
    private PriceMonitoringService priceMonitoringService;

    @GetMapping("/get")
    public ResponseEntity<?> getAllPriceMonitorings() {
        try {
            List<PriceMonitoringResponse> priceMonitorings = priceMonitoringService.getAllPriceMonitorings();
            return ResponseEntity.ok(priceMonitorings);
        } catch (Exception e) {
            // Trả về thông báo lỗi nếu có ngoại lệ
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching price monitorings: " + e.getMessage());
        }
    }

    // Endpoint để lấy PriceMonitoring theo idSubcategory
    @GetMapping("/get/{idSubcategory}")
    public ResponseEntity<?> getPriceMonitoringByIdSubcategory(@PathVariable int idSubcategory) {
        try {
            List<PriceMonitoringResponse> priceMonitorings = priceMonitoringService.getPriceMonitoringByIdSubcategory(idSubcategory);
            if (priceMonitorings.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("No price monitoring data found for subcategory ID: " + idSubcategory);
            }
            return ResponseEntity.ok(priceMonitorings);
        } catch (Exception e) {
            // Trả về thông báo lỗi nếu có ngoại lệ
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching price monitoring data for subcategory ID " + idSubcategory + ": " + e.getMessage());
        }
    }


}
