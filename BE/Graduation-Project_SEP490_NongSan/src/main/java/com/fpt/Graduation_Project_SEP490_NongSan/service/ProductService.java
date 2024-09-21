package com.fpt.Graduation_Project_SEP490_NongSan.service;

import com.fpt.Graduation_Project_SEP490_NongSan.payload.request.ProductRequest;
import com.fpt.Graduation_Project_SEP490_NongSan.payload.response.ProductResponse;

import java.util.List;

public interface ProductService {

    boolean addProduct(ProductRequest productRequest);

    List<ProductResponse> getAllProduct();

    boolean deleteProductById(int idProduct);

    List<ProductResponse> getProductById(int idProduct);

    boolean updateProduct(int idProduct, ProductRequest productRequest);
}
