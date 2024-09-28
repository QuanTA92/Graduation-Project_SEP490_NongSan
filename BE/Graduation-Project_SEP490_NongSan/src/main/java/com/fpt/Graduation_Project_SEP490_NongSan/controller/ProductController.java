package com.fpt.Graduation_Project_SEP490_NongSan.controller;

import com.fpt.Graduation_Project_SEP490_NongSan.payload.request.ProductRequest;
import com.fpt.Graduation_Project_SEP490_NongSan.payload.response.ProductResponse;
import com.fpt.Graduation_Project_SEP490_NongSan.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/product")
public class ProductController {

    @Autowired
    private ProductService productService;

    @PostMapping("/add")
    public ResponseEntity<?> addProduct(@ModelAttribute ProductRequest productRequest) {
        boolean isAdded = productService.addProduct(productRequest);

        if (isAdded) {
            return new ResponseEntity<>("Product added successfully", HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>("Failed to add product", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("")
    public ResponseEntity<List<ProductResponse>> getAllProduct() {
        List<ProductResponse> productResponses = productService.getAllProduct();
        return new ResponseEntity<>(productResponses, HttpStatus.OK);
    }

    @DeleteMapping("/{idProduct}")
    public ResponseEntity<?> deleteProductById(@PathVariable int idProduct) {
        boolean isDeleted = productService.deleteProductById(idProduct);

        if (isDeleted) {
            return ResponseEntity.ok("Product deleted successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found.");
        }
    }

    @GetMapping("/{idProduct}")
    public ResponseEntity<?> getProductDetailsById(@PathVariable int idProduct) {
        List<ProductResponse> productResponses = productService.getProductById(idProduct);

        if (productResponses.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found.");
        } else {
            return new ResponseEntity<>(productResponses.get(0), HttpStatus.OK);
        }
    }

    @PutMapping("/{idProduct}")
    public ResponseEntity<?> updateProductById(@PathVariable int idProduct, @ModelAttribute ProductRequest productRequest) {
        boolean isUpdated = productService.updateProduct(idProduct, productRequest);

        if (isUpdated) {
            return ResponseEntity.ok("Product updated successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Failed to update product or product not found.");
        }
    }



}
