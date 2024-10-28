package com.fpt.Graduation_Project_SEP490_NongSan.service;

import com.fpt.Graduation_Project_SEP490_NongSan.payload.request.CategoriesRequest;
import com.fpt.Graduation_Project_SEP490_NongSan.payload.response.CategoriesResponse;

import java.util.List;

public interface CategoryService {

    boolean addCategory(CategoriesRequest categoriesRequest);

    boolean updateCategory(int idCategory, CategoriesRequest categoriesRequest);

    List<CategoriesResponse> getAllCategories();

    List<CategoriesResponse> getAllCategoriesByIdCategory(int idCategory);

    boolean deleteCategory(int idCategory);
}
