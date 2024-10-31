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
    public ResponseEntity<String> addProduct(@ModelAttribute ProductRequest productRequest) {
        try {
            boolean isAdded = productService.addProduct(productRequest);
            if (isAdded) {
                return new ResponseEntity<>("Product added successfully", HttpStatus.CREATED);
            } else {
                return new ResponseEntity<>("Failed to add product", HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } catch (RuntimeException e) {
            // Trả về thông điệp lỗi chi tiết nếu có ngoại lệ
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            // Xử lý ngoại lệ chung và trả về thông báo lỗi
            return new ResponseEntity<>("An unexpected error occurred: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/update/{idProduct}")
    public ResponseEntity<?> updateProductById(@PathVariable int idProduct, @ModelAttribute ProductRequest productRequest) {
        try {
            boolean isUpdated = productService.updateProduct(idProduct, productRequest);

            if (isUpdated) {
                return ResponseEntity.ok("Product updated successfully.");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Failed to update product or product not found.");
            }
        } catch (RuntimeException e) {
            // Trả về thông điệp lỗi chi tiết nếu có ngoại lệ
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            // Xử lý ngoại lệ chung và trả về thông báo lỗi
            return new ResponseEntity<>("An unexpected error occurred: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/delete/{idProduct}")
    public ResponseEntity<?> deleteProductById(@PathVariable int idProduct) {
        boolean isDeleted = productService.deleteProductById(idProduct);

        if (isDeleted) {
            return ResponseEntity.ok("Product deleted successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found.");
        }
    }

    @GetMapping("/get")
    public ResponseEntity<List<ProductResponse>> getAllProduct() {
        List<ProductResponse> productResponses = productService.getAllProduct();
        return new ResponseEntity<>(productResponses, HttpStatus.OK);
    }

    @GetMapping("/get/{idProduct}")
    public ResponseEntity<?> getProductDetailsById(@PathVariable int idProduct) {
        List<ProductResponse> productResponses = productService.getProductById(idProduct);

        if (productResponses.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found.");
        } else {
            return new ResponseEntity<>(productResponses.get(0), HttpStatus.OK);
        }
    }

    @GetMapping("/get/subcategory/{idSubcategory}")
    public ResponseEntity<?> getProductBySubcategory(@PathVariable int idSubcategory) {
        // Validate idSubcategory (optional, depending on your requirements)
        if (idSubcategory <= 0) {
            return ResponseEntity.badRequest().body("Invalid subcategory ID."); // 400 Bad Request
        }

        List<ProductResponse> productResponses = productService.getProductBySubcategory(idSubcategory);

        if (productResponses.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No products found for this subcategory."); // 404 Not Found
        }

        return ResponseEntity.ok(productResponses); // 200 OK with the list of products
    }

    @GetMapping("/get/name/{productName}")
    public ResponseEntity<?> getProductByName(@PathVariable String productName) {
        List<ProductResponse> productResponses = productService.getProductByName(productName);

        if (productResponses.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No products found with the given name.");
        } else {
            return new ResponseEntity<>(productResponses, HttpStatus.OK);
        }
    }

    @GetMapping("/get/price")
    public ResponseEntity<?> getProductByPrice(
            @RequestParam double minPrice,
            @RequestParam double maxPrice) {
        try {
            List<ProductResponse> productResponses = productService.getProductByPrice(minPrice, maxPrice);

            if (productResponses.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("There are no products in this price range.");
            }

            return new ResponseEntity<>(productResponses, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred: " + e.getMessage());
        }
    }

    @GetMapping("/get/household/{idHouseHold}")
    public ResponseEntity<?> getProductByHousehold(@PathVariable int idHouseHold) {
        try {
            // Gọi service để lấy danh sách sản phẩm theo idHouseHold
            List<ProductResponse> products = productService.getProductByHouseHold(idHouseHold);

            if (products.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("No products found for household ID: " + idHouseHold);
            }

            return ResponseEntity.ok(products);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while retrieving products for household ID: " + idHouseHold);
        }
    }

    @GetMapping("/get/address")
    public ResponseEntity<?> getProductByAddress(
            @RequestParam(required = false) String cityProduct,
            @RequestParam(required = false) String districtProduct,
            @RequestParam(required = false) String wardProduct,
            @RequestParam(required = false) String specificAddressProduct) {

        try {
            List<ProductResponse> products = productService.getProductByAddress(cityProduct, districtProduct, wardProduct, specificAddressProduct);

            if (products.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("No products found for the given address.");
            }

            return ResponseEntity.ok(products);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while retrieving the product by address.");
        }
    }




}