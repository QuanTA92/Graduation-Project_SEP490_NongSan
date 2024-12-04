package com.fpt.Graduation_Project_SEP490_NongSan.controller;

import com.fpt.Graduation_Project_SEP490_NongSan.payload.response.DashboardAdminResponse;
import com.fpt.Graduation_Project_SEP490_NongSan.payload.response.DashboardHouseHoldResponse;
import com.fpt.Graduation_Project_SEP490_NongSan.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/admin")
    public ResponseEntity<?> getDashboardAdmin() {
        try {
            // Gọi phương thức để lấy dữ liệu dashboard
            DashboardAdminResponse dashboardData = dashboardService.getDashboardAdmin();

            // Trả về dữ liệu với mã HTTP 200 OK
            return ResponseEntity.ok(dashboardData);
        } catch (Exception e) {
            // Nếu có lỗi, trả về mã lỗi 500 (Internal Server Error)
            return ResponseEntity.status(500).body("Error retrieving dashboard data");
        }
    }

    @GetMapping("/household")
    public ResponseEntity<?> getDashboardHousehold(@RequestHeader("Authorization") String jwt) {
        try {
            // Gọi phương thức để lấy dữ liệu dashboard cho household, truyền JWT
            DashboardHouseHoldResponse dashboardHouseHoldResponse = dashboardService.getDashboardHouseHold(jwt);

            // Trả về dữ liệu với mã HTTP 200 OK
            return ResponseEntity.ok(dashboardHouseHoldResponse);
        } catch (Exception e) {
            // Nếu có lỗi, trả về mã lỗi 500 (Internal Server Error)
            return ResponseEntity.status(500).body("Error retrieving household dashboard data");
        }
    }


}


