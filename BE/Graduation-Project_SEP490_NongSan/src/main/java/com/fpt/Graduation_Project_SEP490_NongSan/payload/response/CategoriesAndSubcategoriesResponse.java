package com.fpt.Graduation_Project_SEP490_NongSan.payload.response;

import lombok.Data;

import java.util.List;

@Data
public class CategoriesAndSubcategoriesResponse {

    private int idCategory;

    private String nameCategory;

    private List<SubcategoriesResponse> subcategoriesResponses;
}
