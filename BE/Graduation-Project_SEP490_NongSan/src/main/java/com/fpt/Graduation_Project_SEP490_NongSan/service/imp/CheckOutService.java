package com.fpt.Graduation_Project_SEP490_NongSan.service.imp;

import com.fpt.Graduation_Project_SEP490_NongSan.config.VNPayConfig;
import com.fpt.Graduation_Project_SEP490_NongSan.modal.*;
import com.fpt.Graduation_Project_SEP490_NongSan.payload.request.CheckOutRequest;
import com.fpt.Graduation_Project_SEP490_NongSan.payload.response.CartResponse;
import com.fpt.Graduation_Project_SEP490_NongSan.repository.*;
import com.fpt.Graduation_Project_SEP490_NongSan.utils.UserUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
@RequiredArgsConstructor
public class CheckOutService {

    private final CartServiceImpl cartServiceImpl;
    private final OrdersRepository ordersRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final CartRepository cartRepository;

    @Transactional
    public String checkOutWithPayOnline(String jwt, CheckOutRequest checkOutRequest, String urlReturn) {
        // Lấy danh sách ID cart từ CheckOutRequest
        List<Integer> idCartList = checkOutRequest.getIdCart();

        // Lấy danh sách CartResponse theo danh sách ID cart
        List<CartResponse> cartItems = cartServiceImpl.getCartByIdCart(jwt, idCartList);

        // Kiểm tra xem danh sách giỏ hàng có rỗng không
        if (cartItems.isEmpty()) {
            throw new RuntimeException("No carts found for the provided IDs: " + idCartList);
        }

        // Tính tổng giá của tất cả các sản phẩm trong giỏ hàng
        int total = 0;
        for (CartResponse item : cartItems) {
            total += item.getQuantity() * item.getPrice(); // Đảm bảo lấy đúng giá của sản phẩm
        }

        // Tính Admin Commission (1% của tổng tiền)
        int adminCommission = (int) (total * 0.01); // 1% của tổng tiền
        int totalAmountPaid = total + adminCommission; // Tổng tiền thanh toán = Amount_paid + Admin_commission

        // Lấy userId từ JWT và tìm User từ userId
        int userId = UserUtil.getUserIdFromToken();
        User user = userRepository.findById((long) userId).orElseThrow(() ->
                new RuntimeException("User not found with ID: " + userId)
        );

        // Tạo đơn hàng mới và gán user vào đơn hàng
        Orders order = new Orders();
        order.setUser(user);
        order.setTransferContent(checkOutRequest.getTransferContent()); // Lấy transferContent từ CheckOutRequest
        order.setAmount_paid(totalAmountPaid); // Đặt tổng tiền thanh toán bao gồm cả Admin_commission
        order.setAdmin_commission(adminCommission); // Đặt Admin_commission
        order.setCreateDate(new Date());
        order.setStatus("Đã thanh toán");

        // Lưu đơn hàng
        order = ordersRepository.save(order);

        // Thêm các item trong đơn hàng từ giỏ hàng và lưu chúng
        for (CartResponse item : cartItems) {
            // Truy xuất đối tượng Product từ idProduct trong CartResponse
            Product product = productRepository.findById(item.getIdProduct()).orElse(null);
            if (product == null) {
                throw new RuntimeException("Product not found with ID: " + item.getIdProduct());
            }

            // Tạo OrderItem cho mỗi sản phẩm
            OrderItem orderItem = new OrderItem();
            orderItem.setOrders(order);
            orderItem.setQuantity(item.getQuantity());
            orderItem.setPrice(item.getPrice()); // Lấy giá từ CartResponse
            orderItem.setProduct(product); // Gán Product lấy từ productRepository
            orderItem.setCreateDate(new Date());

            // Lưu OrderItem vào cơ sở dữ liệu
            orderItemRepository.save(orderItem);

            // Cập nhật số lượng của sản phẩm sau khi đơn hàng được tạo
            product.setQuantity(product.getQuantity() - item.getQuantity()); // Giảm số lượng của sản phẩm trong kho
            productRepository.save(product); // Lưu lại thông tin sản phẩm đã cập nhật
        }

        // Tạo URL thanh toán qua VNPay
        String paymentUrl = createOrder(order, urlReturn);

        // Xóa từng giỏ hàng bằng cách duyệt qua idCartList
        for (Integer idCart : idCartList) {
            cartServiceImpl.removeCart(idCart); // Xóa giỏ hàng đã được thanh toán
        }

        return paymentUrl; // Trả về URL thanh toán
    }


    public static String createOrder(Orders orders, String urlReturn) {
        String vnp_Version = "2.1.0";
        String vnp_Command = "pay";
//      Id Transaction
        String vnp_TxnRef = VNPayConfig.getRandomNumber(8);
        String vnp_IpAddr = "127.0.0.1";
        String vnp_TmnCode = VNPayConfig.vnp_TmnCode;
        String orderType = "order-type";


//        Put data in VNP
        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnp_Version);
//       Type PayVN
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
//       Value Amount
        vnp_Params.put("vnp_Amount", String.valueOf(orders.getAmount_paid()*100));
        vnp_Params.put("vnp_CurrCode", "VND");

        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        // customer information
        vnp_Params.put("vnp_OrderInfo", orders.getTransferContent());
        vnp_Params.put("vnp_OrderType", orderType);

        String locate = "vn";
        vnp_Params.put("vnp_Locale", locate);
//---------------------------------------
        urlReturn += VNPayConfig.vnp_Returnurl;
        vnp_Params.put("vnp_ReturnUrl", urlReturn);
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);
//----------------------------------------


        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

        List fieldNames = new ArrayList(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        Iterator itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = (String) itr.next();
            String fieldValue = (String) vnp_Params.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                //Build hash data
                hashData.append(fieldName);
                hashData.append('=');
                try {
                    hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                    //Build query
                    query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()));
                    query.append('=');
                    query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                } catch (UnsupportedEncodingException e) {
                    e.printStackTrace();
                }
                if (itr.hasNext()) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }
        String queryUrl = query.toString();
        String vnp_SecureHash = VNPayConfig.hmacSHA512(VNPayConfig.vnp_HashSecret, hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
        String paymentUrl = VNPayConfig.vnp_PayUrl + "?" + queryUrl;

        return paymentUrl;
    }

    public int orderReturn(HttpServletRequest request) {
        Map fields = new HashMap();
        for (Enumeration params = request.getParameterNames(); params.hasMoreElements(); ) {
            String fieldName = null;
            String fieldValue = null;
            try {
                fieldName = URLEncoder.encode((String) params.nextElement(), StandardCharsets.US_ASCII.toString());
                fieldValue = URLEncoder.encode(request.getParameter(fieldName), StandardCharsets.US_ASCII.toString());
            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
            }
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                fields.put(fieldName, fieldValue);
            }
        }

        String vnp_SecureHash = request.getParameter("vnp_SecureHash");
        if (fields.containsKey("vnp_SecureHashType")) {
            fields.remove("vnp_SecureHashType");
        }
        if (fields.containsKey("vnp_SecureHash")) {
            fields.remove("vnp_SecureHash");
        }
        String signValue = VNPayConfig.hashAllFields(fields);
        if (signValue.equals(vnp_SecureHash)) {
            if ("00".equals(request.getParameter("vnp_TransactionStatus"))) {
                return 1;
            } else {
                return 0;
            }
        } else {
            return -1;
        }
    }
}
