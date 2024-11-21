package com.fpt.Graduation_Project_SEP490_NongSan.service.imp;

import com.fpt.Graduation_Project_SEP490_NongSan.modal.Categories;
import com.fpt.Graduation_Project_SEP490_NongSan.modal.Subcategory;
import com.fpt.Graduation_Project_SEP490_NongSan.payload.request.SubcategoryRequest;
import com.fpt.Graduation_Project_SEP490_NongSan.payload.response.SubcategoriesResponse;
import com.fpt.Graduation_Project_SEP490_NongSan.repository.CategoriesRepository;
import com.fpt.Graduation_Project_SEP490_NongSan.repository.SubcategoryRepository;
import com.fpt.Graduation_Project_SEP490_NongSan.service.SubcategoriesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SubcategoriesServiceImpl implements SubcategoriesService {

    @Autowired
    private SubcategoryRepository subcategoryRepository;

    @Autowired
    private CategoriesRepository categoriesRepository;

    @Override
    public boolean addSubcategory(int idCategory, SubcategoryRequest subcategoryRequest) {
        try {
            // Check if the category exists
            Categories category = categoriesRepository.findById(idCategory)
                    .orElseThrow(() -> new RuntimeException("Category not found with ID: " + idCategory));

            // Check if a subcategory with the same name already exists in the category
            boolean subcategoryExists = subcategoryRepository.existsByNameAndCategoryId(subcategoryRequest.getNameSubcategory(), idCategory);
            if (subcategoryExists) {
                throw new RuntimeException("Subcategory with the name '" + subcategoryRequest.getNameSubcategory() + "' already exists in this category.");
            }

            // Create a new Subcategory
            Subcategory subcategory = new Subcategory();
            subcategory.setName(subcategoryRequest.getNameSubcategory());
            subcategory.setCreateDate(new Date()); // Set the creation date
            subcategory.setCategory(category); // Set the relationship back to the category

            // Save the subcategory
            subcategoryRepository.save(subcategory);
            return true; // Successfully added
        } catch (Exception e) {
            e.printStackTrace();
            return false; // Failed to add due to an exception
        }
    }

    @Override
    public boolean updateSubcategory(int idSubcategory, SubcategoryRequest subcategoryRequest) {
        try {
            // Fetch the existing Subcategory
            Subcategory subcategory = subcategoryRepository.findById(idSubcategory)
                    .orElseThrow(() -> new RuntimeException("Subcategory not found with ID: " + idSubcategory));

            // Check if the updated name already exists in the same category
            boolean subcategoryExists = subcategoryRepository.existsByNameAndCategoryId(subcategoryRequest.getNameSubcategory(), subcategory.getCategory().getId());
            if (subcategoryExists) {
                throw new RuntimeException("Subcategory with the name '" + subcategoryRequest.getNameSubcategory() + "' already exists in this category.");
            }

            // Update the subcategory name
            subcategory.setName(subcategoryRequest.getNameSubcategory());

            // Save the updated subcategory
            subcategoryRepository.save(subcategory);
            return true; // Successfully updated
        } catch (Exception e) {
            e.printStackTrace();
            return false; // Failed to update due to an exception
        }
    }

    @Override
    public boolean deleteSubcategory(int idSubcategory) {
        try {
            // Check if the subcategory exists
            if (!subcategoryRepository.existsById(idSubcategory)) {
                throw new RuntimeException("Subcategory not found with ID: " + idSubcategory);
            }

            // Delete the subcategory
            subcategoryRepository.deleteById(idSubcategory);
            return true; // Successfully deleted
        } catch (Exception e) {
            e.printStackTrace();
            return false; // Failed to delete due to an exception
        }
    }

    @Override
    public List<SubcategoriesResponse> getAllSubcategoriesByIdCategory(int idCategory) {
        try {
            // Fetch the subcategories by category ID
            List<Subcategory> subcategories = subcategoryRepository.findByCategoryId(idCategory);

            // Map the Subcategories to SubcategoriesResponse
            return subcategories.stream().map(subcategory -> {
                SubcategoriesResponse response = new SubcategoriesResponse();
                response.setIdSubcategory(subcategory.getId());
                response.setNameSubcategory(subcategory.getName());
                return response;
            }).collect(Collectors.toList());
        } catch (Exception e) {
            e.printStackTrace();
            return List.of(); // Return an empty list in case of an exception
        }
    }
}
