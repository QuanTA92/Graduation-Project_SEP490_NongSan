package com.fpt.Graduation_Project_SEP490_NongSan.service.imp;

import com.fpt.Graduation_Project_SEP490_NongSan.config.JwtProvider;
import com.fpt.Graduation_Project_SEP490_NongSan.modal.*;
import com.fpt.Graduation_Project_SEP490_NongSan.payload.request.ProductRequest;
import com.fpt.Graduation_Project_SEP490_NongSan.repository.*;
import com.fpt.Graduation_Project_SEP490_NongSan.service.ProductService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;

import java.util.Date;

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

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtProvider jwtProvider;

    @Override
    public boolean addProduct(ProductRequest productRequest, HttpServletRequest request) {
        // Get the JWT from the Authorization header
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("JWT token is missing or not properly formatted");
        }

        String token = authHeader.substring(7);

        String email;
        try {
            email = jwtProvider.getEmailFromToken(token);
        } catch (RuntimeException e) {
            throw new RuntimeException("Invalid JWT token: " + e.getMessage());
        }

        // Fetch the user based on the email
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found with email: " + email);
        }

        // Fetch the HouseHoldRole for the user
        HouseHoldRole houseHoldRole = houseHoldRoleRepository.findByUser(user);
        if (houseHoldRole == null) {
            throw new RuntimeException("HouseHoldRole not found for the given user.");
        }

        // Create and save the Product
        Product product = new Product();
        product.setName(productRequest.getProductName());
        product.setDescription(productRequest.getProductDescription());
        product.setExpirationDate(productRequest.getExpirationDate());
        product.setStatus(productRequest.getStatus());
        product.setCreatedAt(new Date()); // Current date
        product.setUpdatedAt(new Date()); // Current date
        product.setQualityCheck(productRequest.getQualityCheck());
        product.setQuantity(productRequest.getQuantity());

        Categories category = categoriesRepository.findById(productRequest.getIdCategories())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        product.setCategories(category);

        Product savedProduct = productRepository.save(product);

        // Create and save the HouseHoldProduct
        HouseHoldProduct houseHoldProduct = new HouseHoldProduct();
        houseHoldProduct.setProduct(savedProduct);
        houseHoldProduct.setHouseHoldRole(houseHoldRole);
        houseHoldProduct.setPrice(productRequest.getPrice());
        houseHoldProduct.setCreateDate(new Date());

        houseHoldProductRepository.save(houseHoldProduct);

        return true;
    }
}

