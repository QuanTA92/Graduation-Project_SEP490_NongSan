package com.fpt.Graduation_Project_SEP490_NongSan.controller;

import com.fpt.Graduation_Project_SEP490_NongSan.payload.request.CartRequest;
import com.fpt.Graduation_Project_SEP490_NongSan.payload.response.CartResponse;
import com.fpt.Graduation_Project_SEP490_NongSan.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @PostMapping("/add")
    public ResponseEntity<?> addCart(@RequestBody CartRequest cartRequest) {
        try {
            boolean isAdded = cartService.addCart(cartRequest); // Nếu có lỗi xảy ra ở đây, sẽ ném ngoại lệ và vào catch
            return new ResponseEntity<>("Cart item added successfully", HttpStatus.CREATED);
        } catch (RuntimeException e) {
            // Kiểm tra xem có phải lỗi do thiếu số lượng không
            if ("Insufficient product quantity available".equals(e.getMessage())) {
                return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
            }
            // Các trường hợp lỗi khác, trả về lỗi nội bộ server
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @DeleteMapping("/delete/{idCart}")
    public ResponseEntity<?> deleteCart(@PathVariable int idCart) {
        try {
            boolean isSuccess = cartService.removeCart(idCart);
            if (isSuccess) {
                return new ResponseEntity<>("Cart item deleted successfully", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Failed to delete cart item", HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/update/{idCart}")
    public ResponseEntity<?> updateCart(@PathVariable int idCart, @RequestBody CartRequest cartRequest) {
        try {
            boolean isUpdated = cartService.updateCart(idCart, cartRequest); // Nếu có lỗi xảy ra, sẽ ném ngoại lệ và vào catch
            if (isUpdated) {
                return new ResponseEntity<>("Cart item updated successfully", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Failed to update cart item", HttpStatus.BAD_REQUEST);
            }
        } catch (RuntimeException e) {
            // Kiểm tra xem có phải lỗi do thiếu số lượng không
            if ("Insufficient product quantity available".equals(e.getMessage())) {
                return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
            }
            // Nếu cart không tồn tại
            if ("Cart not found".equals(e.getMessage())) {
                return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
            }
            // Các trường hợp lỗi khác, trả về lỗi nội bộ server
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @GetMapping("/get")
    public ResponseEntity<?> getAllItemInCarts() {
        try {
            List<CartResponse> cartItems = cartService.getAllItemInCarts(null); // Pass null for JWT if it's handled internally
            return new ResponseEntity<>(cartItems, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/get/idCart")
    public ResponseEntity<?> getItemsInCart(@RequestParam List<Integer> idCart) {
        try {
            // Gọi phương thức getCartByIdCart từ service để lấy thông tin giỏ hàng theo danh sách idCart
            List<CartResponse> cartItems = cartService.getCartByIdCart(null, idCart); // Pass null for JWT if it's handled internally

            if (cartItems.isEmpty()) {
                return new ResponseEntity<>("No cart items found", HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(cartItems, HttpStatus.OK); // Trả về danh sách các CartResponse
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }





}
