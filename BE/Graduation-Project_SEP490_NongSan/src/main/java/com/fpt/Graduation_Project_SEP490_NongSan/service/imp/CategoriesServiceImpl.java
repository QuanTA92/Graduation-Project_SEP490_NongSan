package com.fpt.Graduation_Project_SEP490_NongSan.service.imp;

import com.fpt.Graduation_Project_SEP490_NongSan.modal.Categories;
import com.fpt.Graduation_Project_SEP490_NongSan.payload.request.CategoriesRequest;
import com.fpt.Graduation_Project_SEP490_NongSan.payload.response.CategoriesResponse;
import com.fpt.Graduation_Project_SEP490_NongSan.repository.CategoriesRepository;
import com.fpt.Graduation_Project_SEP490_NongSan.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoriesServiceImpl implements CategoryService {

    @Autowired
    private CategoriesRepository categoriesRepository;

    @Override
    public boolean addCategory(CategoriesRequest categoriesRequest) {
        Categories category = new Categories();
        category.setName(categoriesRequest.getName());
        category.setCreateDate(new Date()); // Assuming you want to set the current date
        categoriesRepository.save(category);
        return true; // Return true if saved successfully
    }

    @Override
    public boolean updateCategory(int idCategory, CategoriesRequest categoriesRequest) {
        Categories category = categoriesRepository.findById(idCategory)
                .orElse(null);
        if (category == null) {
            return false; // Category not found
        }
        category.setName(categoriesRequest.getName());
        categoriesRepository.save(category);
        return true; // Return true if updated successfully
    }

    @Override
    public List<CategoriesResponse> getAllCategories() {
        List<Categories> categoriesList = categoriesRepository.findAll();
        return categoriesList.stream().map(category -> {
            CategoriesResponse response = new CategoriesResponse();
            response.setIdCategory(category.getId());
            response.setNameCategory(category.getName());
            return response;
        }).collect(Collectors.toList());
    }

    @Override
    public List<CategoriesResponse> getAllCategoriesByIdCategory(int idCategory) {
        Categories category = categoriesRepository.findById(idCategory)
                .orElse(null);
        if (category == null) {
            return List.of(); // Return empty list if category not found
        }
        CategoriesResponse response = new CategoriesResponse();
        response.setIdCategory(category.getId());
        response.setNameCategory(category.getName());
        return List.of(response); // Return the found category as a list
    }

    @Override
    public boolean deleteCategory(int idCategory) {
        if (!categoriesRepository.existsById(idCategory)) {
            return false; // Category not found
        }
        categoriesRepository.deleteById(idCategory);
        return true; // Category deleted successfully
    }
}
