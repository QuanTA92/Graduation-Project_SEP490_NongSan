package com.fpt.Graduation_Project_SEP490_NongSan.controller;

import com.fpt.Graduation_Project_SEP490_NongSan.payload.request.SubcategoryRequest;
import com.fpt.Graduation_Project_SEP490_NongSan.payload.response.SubcategoriesResponse;
import com.fpt.Graduation_Project_SEP490_NongSan.service.SubcategoriesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api/subcategories")
public class SubcategoriesController {

    @Autowired
    private SubcategoriesService subcategoriesService;

    @GetMapping("/get/{idCategory}")
    public ResponseEntity<List<SubcategoriesResponse>> getAllSubcategoriesByIdCategory(@PathVariable int idCategory) {
        List<SubcategoriesResponse> subcategories = subcategoriesService.getAllSubcategoriesByIdCategory(idCategory);
        if (subcategories.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT); // No content found for the category
        }
        return new ResponseEntity<>(subcategories, HttpStatus.OK);
    }

    @PostMapping("/add/{idCategory}")
    public ResponseEntity<String> addSubcategory(@PathVariable int idCategory, @RequestBody SubcategoryRequest subcategoryRequest) {
        boolean isAdded = subcategoriesService.addSubcategory(idCategory, subcategoryRequest);
        if (isAdded) {
            return new ResponseEntity<>("Subcategory added successfully.", HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>("Failed to add subcategory. It might already exist.", HttpStatus.CONFLICT);
        }
    }

    @PutMapping("/update/{idSubcategory}")
    public ResponseEntity<String> updateSubcategory(@PathVariable int idSubcategory, @RequestBody SubcategoryRequest subcategoryRequest) {
        boolean isUpdated = subcategoriesService.updateSubcategory(idSubcategory, subcategoryRequest);
        if (isUpdated) {
            return new ResponseEntity<>("Subcategory updated successfully.", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Failed to update subcategory. It might not exist.", HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/delete/{idSubcategory}")
    public ResponseEntity<String> deleteSubcategory(@PathVariable int idSubcategory) {
        boolean isDeleted = subcategoriesService.deleteSubcategory(idSubcategory);
        if (isDeleted) {
            return new ResponseEntity<>("Subcategory deleted successfully.", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Failed to delete subcategory. It might not exist.", HttpStatus.NOT_FOUND);
        }
    }
}
