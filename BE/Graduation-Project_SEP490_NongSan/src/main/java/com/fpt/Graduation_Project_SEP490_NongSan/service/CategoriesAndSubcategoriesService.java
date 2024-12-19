package com.fpt.Graduation_Project_SEP490_NongSan.service;

import com.fpt.Graduation_Project_SEP490_NongSan.payload.request.CategoriesAndSubcategoriesRequest;
import com.fpt.Graduation_Project_SEP490_NongSan.payload.response.CategoriesAndSubcategoriesResponse;

import java.util.List;

public interface CategoriesAndSubcategoriesService {

    List<CategoriesAndSubcategoriesResponse> getAllCategoriesAndSubcategories();

    List<CategoriesAndSubcategoriesResponse> getCategoryAndSubcategoriesByCategoryId(int idCategory);

    boolean addCategoriesAndSubcategories(CategoriesAndSubcategoriesRequest categoriesAndSubcategoriesRequest);
}
