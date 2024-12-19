package com.fpt.Graduation_Project_SEP490_NongSan.payload.response;

import lombok.Data;

import java.util.List;

@Data
public class AllProductOfHouseholdResponse {

    private String fullName;

    private String description;

    private String phone;

    private String email;

    private int totalProducts;

    private List<ProductResponse> productResponses;
}
