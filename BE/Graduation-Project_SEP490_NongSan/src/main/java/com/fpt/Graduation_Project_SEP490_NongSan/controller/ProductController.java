package com.fpt.Graduation_Project_SEP490_NongSan.controller;

import com.fpt.Graduation_Project_SEP490_NongSan.exception.FuncErrorException;
import com.fpt.Graduation_Project_SEP490_NongSan.exception.NotFoundException;
import com.fpt.Graduation_Project_SEP490_NongSan.payload.request.ProductRequest;
import com.fpt.Graduation_Project_SEP490_NongSan.payload.response.ProductResponse;
import com.fpt.Graduation_Project_SEP490_NongSan.service.ProductService;
import com.fpt.Graduation_Project_SEP490_NongSan.service.imp.ProductServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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
        } catch (FuncErrorException e) {
            // Trả về thông điệp lỗi chi tiết từ FuncErrorException
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (NotFoundException e) {
            // Nếu có ngoại lệ NotFoundException, trả về lỗi 404
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (RuntimeException e) {
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
        try {
            // Call the service to delete the product by id
            productService.deleteProductById(idProduct);
            return ResponseEntity.ok("Product deleted successfully.");
        } catch (NotFoundException e) {
            // If the product does not exist, return a 404 error
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (FuncErrorException e) {
            // Handle other exceptions that may occur during the deletion process
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            // Handle the general exception and return an error message
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An unexpected error occurred: " + e.getMessage());
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

    @PostMapping("/image/{id}")
    public ResponseEntity<?> uploadImage(@PathVariable final Integer id, @RequestPart final MultipartFile file) throws ChangeSetPersister.NotFoundException {
        this.productService.uploadImage(id, file);
        return ResponseEntity.ok("Upload successfully");
    }



    @GetMapping("/get/subcategory/{idSubcategory}/price")
    public ResponseEntity<?> getProductsBySubcategoryAndPriceRange(
            @PathVariable int idSubcategory,
            @RequestParam double minPrice,
            @RequestParam double maxPrice) {
        // Validate the input parameters
        if (idSubcategory <= 0 || minPrice < 0 || maxPrice < 0 || maxPrice < minPrice) {
            return ResponseEntity.badRequest().body("Invalid input parameters."); // 400 Bad Request
        }

        try {
            // Call the service method to get the products by subcategory and price range
            List<ProductResponse> productResponses = productService.getProductsBySubcategoryAndPriceRange(idSubcategory, minPrice, maxPrice);

            if (productResponses.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("No products found for this subcategory and price range."); // 404 Not Found
            }

            return ResponseEntity.ok(productResponses); // 200 OK with the list of products
        } catch (Exception e) {
            // Log the exception for debugging purposes
            e.printStackTrace(); // You can use a logging framework like SLF4J or Log4j

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while retrieving products: " + e.getMessage()); // 500 Internal Server Error
        }
    }

    @GetMapping("/get/subcategory/{idSubcategory}/address")
    public ResponseEntity<?> getProductsBySubcategoryAndAddress(
            @PathVariable int idSubcategory,
            @RequestParam(required = false) String cityProduct,
            @RequestParam(required = false) String districtProduct,
            @RequestParam(required = false) String wardProduct,
            @RequestParam(required = false) String specificAddressProduct) {

        // Validate idSubcategory
        if (idSubcategory <= 0) {
            return ResponseEntity.badRequest().body("Invalid subcategory ID."); // 400 Bad Request
        }

        try {
            // Call the service method to get the products by subcategory and address
            List<ProductResponse> productResponses = productService.getProductsBySubcategoryAndAddress(idSubcategory, cityProduct, districtProduct, wardProduct, specificAddressProduct);

            if (productResponses.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("No products found for this subcategory and address."); // 404 Not Found
            }

            return ResponseEntity.ok(productResponses); // 200 OK with the list of products
        } catch (Exception e) {
            // Log the exception for debugging purposes
            e.printStackTrace(); // You can use a logging framework like SLF4J or Log4j

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while retrieving products: " + e.getMessage()); // 500 Internal Server Error
        }
    }

    @GetMapping("/get/subcategory/{idSubcategory}/quantity")
    public ResponseEntity<?> getProductsBySubcategoryAndQuantity(
            @PathVariable int idSubcategory,
            @RequestParam int quantity) {

        // Kiểm tra xem idSubcategory và quantity có hợp lệ không
        if (idSubcategory <= 0 || quantity <= 0) {
            return ResponseEntity.badRequest().body("Invalid subcategory ID or quantity."); // 400 Bad Request
        }

        try {
            // Gọi service để lấy các sản phẩm theo subcategory và quantity
            List<ProductResponse> productResponses = productService.getProductsBySubcategoryAndQuantity(idSubcategory, quantity);

            if (productResponses.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("No products found for this subcategory with the specified quantity."); // 404 Not Found
            }

            return ResponseEntity.ok(productResponses);

        } catch (Exception e) {
            // Log lỗi nếu có
            e.printStackTrace(); // Có thể sử dụng SLF4J hoặc Log4j để log lỗi

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while retrieving products: " + e.getMessage()); // 500 Internal Server Error
        }
    }

}