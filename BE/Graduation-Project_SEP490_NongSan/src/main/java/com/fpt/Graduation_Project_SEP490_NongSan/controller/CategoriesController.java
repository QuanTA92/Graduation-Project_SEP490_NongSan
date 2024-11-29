package com.fpt.Graduation_Project_SEP490_NongSan.controller;

import com.fpt.Graduation_Project_SEP490_NongSan.payload.request.CategoriesRequest;
import com.fpt.Graduation_Project_SEP490_NongSan.payload.response.CategoriesResponse;
import com.fpt.Graduation_Project_SEP490_NongSan.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin
@RestController
@RequestMapping("api/categories")
public class CategoriesController {

    @Autowired
    private CategoryService categoryService;

    @PostMapping("/add") // Change to PostMapping
    public ResponseEntity<String> addCategory(@RequestBody CategoriesRequest categoriesRequest) {
        boolean isSuccess = categoryService.addCategory(categoriesRequest);

        if (isSuccess) {
            return new ResponseEntity<>("Category added successfully", HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>("Failed to add Category", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/get") // Retrieve all categories
    public ResponseEntity<List<CategoriesResponse>> getAllCategories() {
        List<CategoriesResponse> categories = categoryService.getAllCategories();
        return new ResponseEntity<>(categories, HttpStatus.OK);
    }

    @GetMapping("/get/{idCategory}") // Retrieve a category by ID
    public ResponseEntity<CategoriesResponse> getCategoryById(@PathVariable int idCategory) {
        List<CategoriesResponse> category = categoryService.getAllCategoriesByIdCategory(idCategory);
        if (category.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // Not found
        }
        return new ResponseEntity<>(category.get(0), HttpStatus.OK); // Return the found category
    }

    @PutMapping("/update/{idCategory}") // Update a category
    public ResponseEntity<String> updateCategory(@PathVariable int idCategory, @RequestBody CategoriesRequest categoriesRequest) {
        boolean isSuccess = categoryService.updateCategory(idCategory, categoriesRequest);

        if (isSuccess) {
            return new ResponseEntity<>("Category updated successfully", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Category not found", HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/delete/{idCategory}") // New delete endpoint
    public ResponseEntity<String> deleteCategory(@PathVariable int idCategory) {
        boolean isSuccess = categoryService.deleteCategory(idCategory);

        if (isSuccess) {
            return new ResponseEntity<>("Category deleted successfully", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Category not found", HttpStatus.NOT_FOUND);
        }
    }
}
