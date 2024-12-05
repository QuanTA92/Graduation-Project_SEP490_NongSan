package com.fpt.Graduation_Project_SEP490_NongSan.payload.response;

import lombok.Data;

import java.util.Date;

@Data
public class DashboardAdminResponse {

    private int totalAdminCommission;

    private int totalAccount;

    private int totalProductInWeb;

    private int totalOrders;

    private Date createDate;
}
