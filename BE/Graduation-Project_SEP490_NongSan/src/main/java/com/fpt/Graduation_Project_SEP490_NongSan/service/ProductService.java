package com.fpt.Graduation_Project_SEP490_NongSan.service;

import com.fpt.Graduation_Project_SEP490_NongSan.payload.request.ProductRequest;
import com.fpt.Graduation_Project_SEP490_NongSan.payload.response.AllProductOfHouseholdResponse;
import com.fpt.Graduation_Project_SEP490_NongSan.payload.response.ProductResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ProductService {

    boolean addProduct(ProductRequest productRequest);

    boolean deleteProductById(int idProduct);

    boolean updateProduct(int idProduct, ProductRequest productRequest);

    List<ProductResponse> getAllProduct();

    List<ProductResponse> getProductById(int idProduct);

    List<ProductResponse> getProductByName(String productName);

    List<ProductResponse> getProductByPrice(double minPrice, double maxPrice);

    AllProductOfHouseholdResponse getProductByHouseHold(int idHouseHold);

    List<ProductResponse> getProductByAddress(String cityProduct, String districtProduct, String wardProduct, String specificAddressProduct);

    List<ProductResponse> getProductForHouseHold(String jwt);

    void uploadImage(final Integer id, final MultipartFile file);

    List<ProductResponse> getProductByCategory(int idCategory);

    List<ProductResponse> getProductBySubcategory(int idSubcategory);

    List<ProductResponse> getProductsBySubcategoryAndPriceRange(int idSubcategory, double minPrice, double maxPrice);

    List<ProductResponse> getProductsBySubcategoryAndAddress(int idSubcategory, String cityProduct, String districtProduct, String wardProduct, String specificAddressProduct);

    List<ProductResponse> getProductsBySubcategoryAndQuantity(int idSubcategory, int quantity);

}
