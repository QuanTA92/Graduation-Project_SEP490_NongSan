package com.fpt.Graduation_Project_SEP490_NongSan.payload.request;

import lombok.Data;

import java.util.List;

@Data
public class CategoriesAndSubcategoriesRequest {

    private String nameCategory;

    private List<SubcategoryRequest> subcategoryRequests;

}
