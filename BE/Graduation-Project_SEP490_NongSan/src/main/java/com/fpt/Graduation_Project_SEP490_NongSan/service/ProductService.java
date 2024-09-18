package com.fpt.Graduation_Project_SEP490_NongSan.service;

import com.fpt.Graduation_Project_SEP490_NongSan.modal.Product;
import com.fpt.Graduation_Project_SEP490_NongSan.payload.request.ProductRequest;

public interface ProductService {

    boolean addProduct(ProductRequest productRequest);
}
