package com.fpt.Graduation_Project_SEP490_NongSan.controller;

import com.fpt.Graduation_Project_SEP490_NongSan.payload.request.CategoriesAndSubcategoriesRequest;
import com.fpt.Graduation_Project_SEP490_NongSan.payload.response.CategoriesAndSubcategoriesResponse;
import com.fpt.Graduation_Project_SEP490_NongSan.service.CategoriesAndSubcategoriesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin
@RestController
@RequestMapping("/api/categoriesAndSubcategories")
public class CategoriesAndSubcategoriesController {

    @Autowired
    private CategoriesAndSubcategoriesService categoriesAndSubcategoriesService;

    @GetMapping("/get")
    public ResponseEntity<List<CategoriesAndSubcategoriesResponse>> getAllCategoriesAndSubcategories() {
        try {
            List<CategoriesAndSubcategoriesResponse> categoriesList = categoriesAndSubcategoriesService.getAllCategoriesAndSubcategories();
            return new ResponseEntity<>(categoriesList, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getById/{idCategory}")
    public ResponseEntity<CategoriesAndSubcategoriesResponse> getCategoryAndSubcategoriesById(@PathVariable int idCategory) {
        try {
            List<CategoriesAndSubcategoriesResponse> categoryList = categoriesAndSubcategoriesService.getCategoryAndSubcategoriesByCategoryId(idCategory);
            if (!categoryList.isEmpty()) {
                return new ResponseEntity<>(categoryList.get(0), HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/add")
    public ResponseEntity<String> addCategoriesAndSubcategories(@RequestBody CategoriesAndSubcategoriesRequest categoriesAndSubcategoriesRequest) {
        try {
            boolean isAdded = categoriesAndSubcategoriesService.addCategoriesAndSubcategories(categoriesAndSubcategoriesRequest);
            if (isAdded) {
                return new ResponseEntity<>("Category and subcategories added successfully", HttpStatus.CREATED);
            } else {
                return new ResponseEntity<>("Failed to add category and subcategories", HttpStatus.BAD_REQUEST);
            }
        } catch (RuntimeException e) {
            // Capture specific RuntimeException for existing category or subcategory
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("An error occurred while processing the request.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



}
