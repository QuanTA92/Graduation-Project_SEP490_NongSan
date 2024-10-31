package com.fpt.Graduation_Project_SEP490_NongSan.payload.response;

import lombok.Data;

@Data
public class PriceMonitoringResponse {

    private int idSubcategory;

    private String nameSubcategory;

    private int maxPrice;

    private int minPrice;

}
