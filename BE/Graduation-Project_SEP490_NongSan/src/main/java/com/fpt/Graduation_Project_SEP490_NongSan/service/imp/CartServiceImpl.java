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

    @Override
    public boolean addCart(CartRequest cartRequest) {
        try {
            // Lấy ID người dùng từ JWT bằng UserUtil
            int idUser = userUtil.getUserIdFromToken();

            // Lấy người dùng từ repository
            User user = userRepository.findById((long) idUser).orElse(null);
            if (user == null) {
                throw new RuntimeException("User not found");
            }

            // Lấy sản phẩm từ repository
            Product product = productRepository.findById(cartRequest.getIdProduct()).orElse(null);
            if (product == null) {
                throw new RuntimeException("Product not found");
            }

            // Kiểm tra xem cart đã tồn tại chưa
            Cart existingCart = cartRepository.findByUserAndProduct(user, product);
            if (existingCart != null) {
                // Nếu cart đã tồn tại, cập nhật số lượng
                existingCart.setQuantity(existingCart.getQuantity() + cartRequest.getQuantity());
                cartRepository.save(existingCart); // Lưu lại cart đã cập nhật
            } else {
                // Nếu cart chưa tồn tại, tạo mới
                Cart newCart = new Cart();
                newCart.setUser(user);
                newCart.setProduct(product);
                newCart.setQuantity(cartRequest.getQuantity());
                newCart.setCreateDate(new Date());
                cartRepository.save(newCart); // Lưu cart mới
            }

            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public boolean updateCart(int idCart, CartRequest cartRequest) {
        try {
            // Tìm cart theo ID
            Cart cart = cartRepository.findById(idCart).orElse(null);
            if (cart == null) {
                throw new RuntimeException("Cart not found"); // Nếu không tìm thấy cart
            }

            if (cartRequest.getQuantity() <= 0) {
                cartRepository.delete(cart);
                return true; //
            } else {
                cart.setQuantity(cartRequest.getQuantity());
                cartRepository.save(cart);
                return true;
            }
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public boolean removeCart(int idCart) {
        try {
            // Tìm cart theo ID
            Cart cart = cartRepository.findById(idCart).orElse(null);
            if (cart == null) {
                throw new RuntimeException("Cart not found");
            }
            cartRepository.delete(cart);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public List<CartResponse> getAllItemInCarts(String jwt) {
        try {
            // Lấy ID người dùng từ JWT
            int userId = UserUtil.getUserIdFromToken();

            // Lấy người dùng từ repository
            User user = userRepository.findById((long) userId).orElse(null);
            if (user == null) {
                throw new RuntimeException("User not found");
            }

            // Lấy danh sách các Cart của người dùng
            List<Cart> cartList = cartRepository.findByUser(user);

            // Chuyển đổi danh sách Cart sang danh sách CartResponse
            List<CartResponse> cartResponseList = cartList.stream().map(cart -> {
                CartResponse cartResponse = new CartResponse();
                cartResponse.setIdCart(cart.getId());
                cartResponse.setIdHouseHold(Math.toIntExact(cart.getProduct().getHouseHoldProducts().get(0).getUser().getId()));
                cartResponse.setIdProduct(cart.getProduct().getId().intValue());
                cartResponse.setNameProduct(cart.getProduct().getName());
                cartResponse.setNameHouseHold(cart.getProduct().getHouseHoldProducts().get(0).getUser().getFullname());
                cartResponse.setQuantity(cart.getQuantity());
                cartResponse.setPrice((int) cart.getProduct().getHouseHoldProducts().get(0).getPrice());

                // Lấy hình ảnh đầu tiên
                cartResponse.setFirstImage(cart.getProduct().getImageProducts()
                        .isEmpty() ? null : cart.getProduct().getImageProducts().get(0).getImageUrl());

                // Lấy thông tin địa chỉ từ sản phẩm
                if (cart.getProduct().getAddress() != null) {
                    cartResponse.setAddressProduct(cart.getProduct().getAddress().getSpecificAddress());
                    cartResponse.setWardProduct(cart.getProduct().getAddress().getWard());
                    cartResponse.setDistrictProduct(cart.getProduct().getAddress().getDistrict());
                    cartResponse.setCityProduct(cart.getProduct().getAddress().getCity());
                }

                cartResponse.setNameSubcategoryProduct(cart.getProduct().getSubcategory().getName());
                return cartResponse;
            }).toList();

            return cartResponseList;
        } catch (Exception e) {
            e.printStackTrace();
            return List.of(); // Trả về danh sách rỗng nếu có lỗi xảy ra
        }
    }

    @Override
    public List<CartResponse> getCartByIdCart(String jwt, List<Integer> idCart) {
        try {
            // Lấy ID người dùng từ JWT
            int userId = userUtil.getUserIdFromToken();

            // Lấy người dùng từ repository
            User user = userRepository.findById((long) userId).orElse(null);
            if (user == null) {
                throw new RuntimeException("User not found");
            }

            // Lấy danh sách các Cart theo danh sách idCartList và người dùng
            List<Cart> carts = cartRepository.findByIdInAndUser(idCart, user);
            if (carts.isEmpty()) {
                return List.of(); // Trả về danh sách rỗng nếu không tìm thấy giỏ hàng
            }

            // Chuyển đổi danh sách Cart sang danh sách CartResponse
            List<CartResponse> cartResponseList = carts.stream().map(cart -> {
                CartResponse cartResponse = new CartResponse();
                cartResponse.setIdCart(cart.getId());
                cartResponse.setIdHouseHold(Math.toIntExact(cart.getProduct().getHouseHoldProducts().get(0).getUser().getId()));
                cartResponse.setIdProduct(cart.getProduct().getId().intValue());
                cartResponse.setNameProduct(cart.getProduct().getName());
                cartResponse.setNameHouseHold(cart.getProduct().getHouseHoldProducts().get(0).getUser().getFullname());
                cartResponse.setQuantity(cart.getQuantity());
                cartResponse.setPrice((int) cart.getProduct().getHouseHoldProducts().get(0).getPrice());

                cartResponse.setFirstImage(cart.getProduct().getImageProducts()
                        .isEmpty() ? null : cart.getProduct().getImageProducts().get(0).getImageUrl());
                cartResponse.setNameSubcategoryProduct(cart.getProduct().getSubcategory().getName());

                if (cart.getProduct().getAddress() != null) {
                    cartResponse.setAddressProduct(cart.getProduct().getAddress().getSpecificAddress());
                    cartResponse.setWardProduct(cart.getProduct().getAddress().getWard());
                    cartResponse.setDistrictProduct(cart.getProduct().getAddress().getDistrict());
                    cartResponse.setCityProduct(cart.getProduct().getAddress().getCity());
                }

                return cartResponse;
            }).toList();

            return cartResponseList;
        } catch (Exception e) {
            e.printStackTrace();
            return List.of(); // Trả về danh sách rỗng nếu có lỗi xảy ra
        }
    }


}
