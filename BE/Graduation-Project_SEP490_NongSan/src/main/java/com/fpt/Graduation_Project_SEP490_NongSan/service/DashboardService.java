package com.fpt.Graduation_Project_SEP490_NongSan.service;

import com.fpt.Graduation_Project_SEP490_NongSan.payload.response.DashboardAdminResponse;
import com.fpt.Graduation_Project_SEP490_NongSan.payload.response.DashboardHouseHoldResponse;

public interface DashboardService {

    DashboardAdminResponse getDashboardAdmin();

    DashboardHouseHoldResponse getDashboardHouseHold(String jwt);
}
