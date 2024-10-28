package com.fpt.Graduation_Project_SEP490_NongSan.service;

import com.fpt.Graduation_Project_SEP490_NongSan.payload.request.ProductRequest;
import com.fpt.Graduation_Project_SEP490_NongSan.payload.response.ProductResponse;

import java.util.List;

public interface ProductService {

    boolean addProduct(ProductRequest productRequest);

    boolean deleteProductById(int idProduct);

    boolean updateProduct(int idProduct, ProductRequest productRequest);

    List<ProductResponse> getAllProduct();

    List<ProductResponse> getProductById(int idProduct);

    List<ProductResponse> getProductBySubcategory(int idSubcategory);

    List<ProductResponse> getProductByName(String productName);

    List<ProductResponse> getProductByPrice(double minPrice, double maxPrice);

    List<ProductResponse> getProductByHouseHold(int idHouseHold);

    List<ProductResponse> getProductByAddress(String cityProduct, String districtProduct, String wardProduct, String specificAddressProduct);
}
