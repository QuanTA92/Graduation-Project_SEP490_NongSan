package com.fpt.Graduation_Project_SEP490_NongSan.service;

import com.fpt.Graduation_Project_SEP490_NongSan.payload.request.ProductRequest;
import jakarta.servlet.http.HttpServletRequest;

public interface ProductService {

    boolean addProduct(ProductRequest productRequest, HttpServletRequest request);
}
