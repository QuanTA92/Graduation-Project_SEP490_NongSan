package com.fpt.Graduation_Project_SEP490_NongSan.service.imp;

import com.fpt.Graduation_Project_SEP490_NongSan.modal.Categories;
import com.fpt.Graduation_Project_SEP490_NongSan.modal.Subcategory;
import com.fpt.Graduation_Project_SEP490_NongSan.payload.request.CategoriesAndSubcategoriesRequest;
import com.fpt.Graduation_Project_SEP490_NongSan.payload.request.SubcategoryRequest;
import com.fpt.Graduation_Project_SEP490_NongSan.payload.response.CategoriesAndSubcategoriesResponse;
import com.fpt.Graduation_Project_SEP490_NongSan.payload.response.SubcategoriesResponse;
import com.fpt.Graduation_Project_SEP490_NongSan.repository.CategoriesRepository;
import com.fpt.Graduation_Project_SEP490_NongSan.service.CategoriesAndSubcategoriesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoriesAndSubcategoriesServiceImpl implements CategoriesAndSubcategoriesService {

    @Autowired
    private CategoriesRepository categoriesRepository;

    @Override
    public List<CategoriesAndSubcategoriesResponse> getAllCategoriesAndSubcategories() {
        // Fetch all categories with their subcategories
        List<Categories> categoriesList = categoriesRepository.findAll();

        // Map each Categories entity to CategoriesAndSubcategoriesResponse
        return categoriesList.stream().map(category -> {
            CategoriesAndSubcategoriesResponse response = new CategoriesAndSubcategoriesResponse();
            response.setIdCategory(category.getId());
            response.setNameCategory(category.getName());

            // Map each subcategory within the category
            List<SubcategoriesResponse> subcategoriesResponses = category.getSubcategories().stream().map(subcategory -> {
                SubcategoriesResponse subResponse = new SubcategoriesResponse();
                subResponse.setIdSubcategory(subcategory.getId());
                subResponse.setNameSubcategory(subcategory.getName());
                return subResponse;
            }).collect(Collectors.toList());

            response.setSubcategoriesResponses(subcategoriesResponses);
            return response;
        }).collect(Collectors.toList());
    }

    @Override
    public List<CategoriesAndSubcategoriesResponse> getCategoryAndSubcategoriesByCategoryId(int idCategory) {
        // Fetch category by ID and check if it exists
        Categories category = categoriesRepository.findById(idCategory)
                .orElseThrow(() -> new RuntimeException("Category not found with ID: " + idCategory));

        // Map category to response
        CategoriesAndSubcategoriesResponse response = new CategoriesAndSubcategoriesResponse();
        response.setIdCategory(category.getId());
        response.setNameCategory(category.getName());

        // Map each subcategory within the category
        List<SubcategoriesResponse> subcategoriesResponses = category.getSubcategories().stream().map(subcategory -> {
            SubcategoriesResponse subResponse = new SubcategoriesResponse();
            subResponse.setIdSubcategory(subcategory.getId());
            subResponse.setNameSubcategory(subcategory.getName());
            return subResponse;
        }).collect(Collectors.toList());

        response.setSubcategoriesResponses(subcategoriesResponses);

        // Return as a list containing one element
        return List.of(response);
    }

    @Override
    public boolean addCategoriesAndSubcategories(CategoriesAndSubcategoriesRequest categoriesAndSubcategoriesRequest) {
        try {
            // Check if the category already exists
            if (categoriesRepository.existsByName(categoriesAndSubcategoriesRequest.getNameCategory())) {
                throw new RuntimeException("Category already exists with name: " + categoriesAndSubcategoriesRequest.getNameCategory());
            }

            // Create a new Categories object
            Categories newCategory = new Categories();
            newCategory.setName(categoriesAndSubcategoriesRequest.getNameCategory());
            newCategory.setCreateDate(new Date()); // Set the creation date

            // Check if there are subcategories in the request
            if (categoriesAndSubcategoriesRequest.getSubcategoryRequests() != null) {
                List<Subcategory> subcategories = categoriesAndSubcategoriesRequest.getSubcategoryRequests().stream()
                        .map(subcategoryRequest -> {
                            // Check if the subcategory already exists in this category
                            if (subcategoryRequest.getNameSubcategory() != null && !subcategoryRequest.getNameSubcategory().isEmpty()) {
                                if (categoriesRepository.existsSubcategoryByNameAndCategoryId(subcategoryRequest.getNameSubcategory(), newCategory.getId())) {
                                    throw new RuntimeException("Subcategory already exists with name: " + subcategoryRequest.getNameSubcategory());
                                }
                            }

                            Subcategory newSubcategory = new Subcategory();
                            newSubcategory.setName(subcategoryRequest.getNameSubcategory());
                            newSubcategory.setCreateDate(new Date()); // Set the creation date
                            newSubcategory.setCategory(newCategory); // Set the relationship back to the category
                            return newSubcategory;
                        }).collect(Collectors.toList());

                // Set the list of subcategories in the category
                newCategory.setSubcategories(subcategories);
            }

            // Save the new category (and subcategories due to CascadeType.ALL)
            categoriesRepository.save(newCategory);
            return true; // Successfully added
        } catch (RuntimeException e) {
            // Handle runtime exceptions (for duplicates)
            e.printStackTrace();
            throw e; // Propagate the exception to the controller for proper handling
        } catch (Exception e) {
            e.printStackTrace();
            return false; // Failed to add due to an exception
        }
    }



}
