package com.fpt.Graduation_Project_SEP490_NongSan.service;

import com.fpt.Graduation_Project_SEP490_NongSan.payload.request.SubcategoryRequest;
import com.fpt.Graduation_Project_SEP490_NongSan.payload.response.SubcategoriesResponse;

import java.util.List;

public interface SubcategoriesService {

    boolean addSubcategory(int idCategory, SubcategoryRequest subcategoryRequest);

    boolean updateSubcategory(int idSubcategory, SubcategoryRequest subcategoryRequest);

    boolean deleteSubcategory(int idSubcategory);

    List<SubcategoriesResponse> getAllSubcategoriesByIdCategory(int idCategory);
}
