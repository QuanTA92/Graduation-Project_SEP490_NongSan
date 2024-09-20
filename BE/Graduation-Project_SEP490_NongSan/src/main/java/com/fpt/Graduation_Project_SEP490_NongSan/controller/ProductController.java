package com.fpt.Graduation_Project_SEP490_NongSan.controller;

import com.fpt.Graduation_Project_SEP490_NongSan.payload.request.ProductRequest;
import com.fpt.Graduation_Project_SEP490_NongSan.service.ProductService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.sql.Date;


@RestController
@RequestMapping("/api/product")
public class ProductController {

    @Autowired
    private ProductService productService;

    @PostMapping("/add")
    public ResponseEntity<String> addProduct(
            @RequestParam("productName") String productName,
            @RequestParam("productImage") MultipartFile productImage,
            @RequestParam("productDescription") String productDescription,
            @RequestParam("expirationDate") String expirationDate,
            @RequestParam("status") String status,
            @RequestParam("qualityCheck") String qualityCheck,
            @RequestParam("quantity") int quantity,
            @RequestParam("idCategories") int idCategories,
            @RequestParam("price") double price,
            HttpServletRequest request) {

        ProductRequest productRequest = new ProductRequest();
        productRequest.setProductName(productName);
        productRequest.setProductImage(productImage);
        productRequest.setProductDescription(productDescription);
        productRequest.setExpirationDate(Date.valueOf(expirationDate));
        productRequest.setStatus(status);
        productRequest.setQualityCheck(qualityCheck);
        productRequest.setQuantity(quantity);
        productRequest.setIdCategories(idCategories);
        productRequest.setPrice(price);

        try {
            boolean isAdded = productService.addProduct(productRequest, request);
            if (isAdded) {
                return new ResponseEntity<>("Product added successfully", HttpStatus.CREATED);
            } else {
                return new ResponseEntity<>("Failed to add product", HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}


