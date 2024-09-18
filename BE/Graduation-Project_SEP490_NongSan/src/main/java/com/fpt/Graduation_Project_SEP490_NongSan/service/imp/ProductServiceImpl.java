package com.fpt.Graduation_Project_SEP490_NongSan.service.imp;

import com.fpt.Graduation_Project_SEP490_NongSan.config.JwtProvider;
import com.fpt.Graduation_Project_SEP490_NongSan.modal.Categories;
import com.fpt.Graduation_Project_SEP490_NongSan.modal.HouseHoldProduct;
import com.fpt.Graduation_Project_SEP490_NongSan.modal.HouseHoldRole;
import com.fpt.Graduation_Project_SEP490_NongSan.modal.Product;
import com.fpt.Graduation_Project_SEP490_NongSan.payload.request.ProductRequest;
import com.fpt.Graduation_Project_SEP490_NongSan.repository.CategoriesRepository;
import com.fpt.Graduation_Project_SEP490_NongSan.repository.HouseHoldProductRepository;
import com.fpt.Graduation_Project_SEP490_NongSan.repository.HouseHoldRoleRepository;
import com.fpt.Graduation_Project_SEP490_NongSan.repository.ProductRepository;
import com.fpt.Graduation_Project_SEP490_NongSan.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoriesRepository categoriesRepository;

    @Autowired
    private HouseHoldRoleRepository houseHoldRoleRepository;

    @Autowired
    private HouseHoldProductRepository houseHoldProductRepository;


    @Override
    public boolean addProduct(ProductRequest productRequest) {
        return false;
    }

}
