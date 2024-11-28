package com.fpt.Graduation_Project_SEP490_NongSan.service.imp;

import com.fpt.Graduation_Project_SEP490_NongSan.modal.Cart;
import com.fpt.Graduation_Project_SEP490_NongSan.modal.Product;
import com.fpt.Graduation_Project_SEP490_NongSan.modal.User;
import com.fpt.Graduation_Project_SEP490_NongSan.payload.request.CartRequest;
import com.fpt.Graduation_Project_SEP490_NongSan.payload.response.CartResponse;
import com.fpt.Graduation_Project_SEP490_NongSan.repository.CartRepository;
import com.fpt.Graduation_Project_SEP490_NongSan.repository.ProductRepository;
import com.fpt.Graduation_Project_SEP490_NongSan.repository.UserRepository;
import com.fpt.Graduation_Project_SEP490_NongSan.service.CartService;
import com.fpt.Graduation_Project_SEP490_NongSan.utils.UserUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CartServiceImpl implements CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserUtil userUtil;

    // Tìm người dùng từ ID
    private User getUserFromToken() {
        int idUser = userUtil.getUserIdFromToken();
        return userRepository.findById((long) idUser).orElseThrow(() -> new RuntimeException("User not found"));
    }

    // Tìm sản phẩm từ ID
    private Product getProductFromId(int productId) {
        return productRepository.findById(productId).orElseThrow(() -> new RuntimeException("Product not found"));
    }

    // Tạo CartResponse từ Cart
    private CartResponse convertToCartResponse(Cart cart) {
        CartResponse cartResponse = new CartResponse();
        cartResponse.setIdCart(cart.getId());
        cartResponse.setIdHouseHold(Math.toIntExact(cart.getProduct().getHouseHoldProducts().get(0).getUser().getId()));
        cartResponse.setIdProduct(cart.getProduct().getId().intValue());
        cartResponse.setNameProduct(cart.getProduct().getName());
        cartResponse.setNameHouseHold(cart.getProduct().getHouseHoldProducts().get(0).getUser().getFullname());
        cartResponse.setPrice(cart.getProduct().getHouseHoldProducts().get(0).getPrice());
        cartResponse.setFirstImage(cart.getProduct().getImageProducts()
                .isEmpty() ? null : cart.getProduct().getImageProducts().get(0).getImageUrl());

        if (cart.getProduct().getAddress() != null) {
            cartResponse.setAddressProduct(cart.getProduct().getAddress().getSpecificAddress());
            cartResponse.setWardProduct(cart.getProduct().getAddress().getWard());
            cartResponse.setDistrictProduct(cart.getProduct().getAddress().getDistrict());
            cartResponse.setCityProduct(cart.getProduct().getAddress().getCity());
        }

        cartResponse.setNameSubcategoryProduct(cart.getProduct().getSubcategory().getName());

        // Kiểm tra xem số lượng sản phẩm trong giỏ hàng có vượt quá số lượng trong kho không
        if (cart.getQuantity() > cart.getProduct().getQuantity()) {
            cartResponse.setQuantityStatus("Không đủ số lượng sản phẩm hiện có");  // Gán thông báo vào quantityStatus
            cartResponse.setQuantity(cart.getQuantity());  // Bạn có thể giữ quantity là 0 hoặc giá trị khác nếu số lượng không đủ
        } else {
            cartResponse.setQuantity(cart.getQuantity());  // Số lượng giỏ hàng hợp lệ
            cartResponse.setQuantityStatus("Đủ số lượng sản phẩm");  // Không có thông báo lỗi
        }

        return cartResponse;
    }

    @Override
    public boolean addCart(CartRequest cartRequest) {
        try {
            User user = getUserFromToken();
            Product product = getProductFromId(cartRequest.getIdProduct());

            // Kiểm tra xem số lượng yêu cầu có vượt quá số lượng sản phẩm tồn kho không
            if (product.getQuantity() < cartRequest.getQuantity()) {
                throw new RuntimeException("Insufficient product quantity available");
            }

            // Kiểm tra xem sản phẩm đã có trong giỏ hàng của người dùng chưa
            Cart existingCart = cartRepository.findByUserAndProduct(user, product);

            if (existingCart != null) {
                // Tính tổng số lượng giỏ hàng mới
                int newQuantity = existingCart.getQuantity() + cartRequest.getQuantity();

                // Kiểm tra nếu tổng số lượng giỏ hàng mới vượt quá số lượng sản phẩm tồn kho
                if (newQuantity > product.getQuantity()) {
                    throw new RuntimeException("Cannot add more to cart. Only " + product.getQuantity() + " items available.");
                }

                existingCart.setQuantity(newQuantity);
                cartRepository.save(existingCart);
            } else {
                // Tạo mới giỏ hàng nếu chưa có
                if (cartRequest.getQuantity() > product.getQuantity()) {
                    throw new RuntimeException("Cannot add more to cart. Only " + product.getQuantity() + " items available.");
                }
                Cart newCart = new Cart();
                newCart.setUser(user);
                newCart.setProduct(product);
                newCart.setQuantity(cartRequest.getQuantity());
                newCart.setCreateDate(new Date());
                cartRepository.save(newCart);
            }
            return true;
        } catch (RuntimeException e) {
            throw e;  // Ném lại exception nếu có lỗi
        } catch (Exception e) {
            throw new RuntimeException("Internal server error");
        }
    }


    @Override
    public boolean updateCart(int idCart, CartRequest cartRequest) {
        try {
            Cart cart = cartRepository.findById(idCart).orElseThrow(() -> new RuntimeException("Cart not found"));
            Product product = cart.getProduct();

            if (product.getQuantity() < cartRequest.getQuantity()) {
                throw new RuntimeException("Insufficient product quantity available");
            }

            if (cartRequest.getQuantity() <= 0) {
                cartRepository.delete(cart);
            } else {
                cart.setQuantity(cartRequest.getQuantity());
                cartRepository.save(cart);
            }
            return true;
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Internal server error");
        }
    }

    @Override
    public boolean removeCart(int idCart) {
        try {
            Cart cart = cartRepository.findById(idCart).orElseThrow(() -> {
                String errorMessage = "Cart with ID " + idCart + " not found!";
                System.err.println(errorMessage); // In ra lỗi chi tiết
                return new RuntimeException(errorMessage);
            });
            cartRepository.delete(cart); // Xóa cart khỏi database
            return true;
        } catch (RuntimeException e) {
            System.err.println("Error during cart removal: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }


    @Override
    public List<CartResponse> getAllItemInCarts(String jwt) {
        try {
            User user = getUserFromToken();
            List<Cart> cartList = cartRepository.findByUser(user);
            return cartList.stream().map(this::convertToCartResponse).collect(Collectors.toList());
        } catch (Exception e) {
            e.printStackTrace();
            return List.of();
        }
    }

    @Override
    public List<CartResponse> getCartByIdCart(String jwt, List<Integer> idCart) {
        try {
            User user = getUserFromToken();
            List<Cart> carts = cartRepository.findByIdInAndUser(idCart, user);
            if (carts.isEmpty()) {
                return List.of();
            }
            return carts.stream().map(this::convertToCartResponse).collect(Collectors.toList());
        } catch (Exception e) {
            e.printStackTrace();
            return List.of();
        }
    }
}
