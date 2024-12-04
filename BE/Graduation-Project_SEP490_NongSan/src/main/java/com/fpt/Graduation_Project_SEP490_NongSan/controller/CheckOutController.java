package com.fpt.Graduation_Project_SEP490_NongSan.controller;

import com.fpt.Graduation_Project_SEP490_NongSan.payload.request.CheckOutRequest;
import com.fpt.Graduation_Project_SEP490_NongSan.service.imp.CheckOutService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@CrossOrigin
@Controller
@RequiredArgsConstructor
public class CheckOutController {

    private final CheckOutService checkOutService;

    @PostMapping(value = "/checkout")
    public ResponseEntity<?> checkOut(@ModelAttribute CheckOutRequest checkOutRequest,
                                      HttpServletRequest request) {
        // Kiểm tra xem idCart có null không
        if (checkOutRequest.getIdCart() == null || checkOutRequest.getIdCart().isEmpty()) {
            return ResponseEntity.badRequest().body("Cart IDs must be provided");
        }

        // Lấy base URL cho VNPay
        String baseUrl = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort();

        // Lấy JWT từ header
        String jwt = request.getHeader("Authorization");
        if (jwt == null || jwt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authorization token is missing");
        }

        String vnpayUrl;
        try {
            // Gọi phương thức checkOutWithPayOnline với JWT và CheckOutRequest
            vnpayUrl = checkOutService.checkOutWithPayOnline(jwt, checkOutRequest, baseUrl);
        } catch (RuntimeException e) {
            // Xử lý ngoại lệ, có thể thêm log hoặc trả về thông báo lỗi
            System.err.println("Error during checkout: " + e.getMessage());
            // Trả về một thông báo lỗi trong ResponseEntity
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error during checkout: " + e.getMessage());
        }

        // Trả về URL VNPay với HTTP 200 OK status
        return ResponseEntity.ok(vnpayUrl);
    }

    @GetMapping("/vnpay-payment")
    public ResponseEntity<?> getPaymentStatus(HttpServletRequest request, HttpServletResponse response) {
        // Xử lý kết quả thanh toán
        int paymentStatus = checkOutService.orderReturn(request);

        // Lấy thông tin thanh toán từ request
        String orderInfo = request.getParameter("vnp_OrderInfo");
        String paymentTime = request.getParameter("vnp_PayDate");
        String transactionId = request.getParameter("vnp_TransactionNo");
        String totalPrice = request.getParameter("vnp_Amount");

        // Tạo đối tượng kết quả thanh toán
        Map<String, Object> result = new HashMap<>();
        result.put("orderId", orderInfo);
        result.put("totalPrice", totalPrice);
        result.put("paymentTime", paymentTime);
        result.put("transactionId", transactionId);
        result.put("paymentStatus", paymentStatus == 1 ? "Success" : "Fail");

        // Kiểm tra nếu thanh toán thành công
        if (paymentStatus == 1) {
            // Chuyển hướng đến URL yêu cầu
            try {
                response.sendRedirect("http://localhost:3000/orderhistory");
                return null;  // Không trả về ResponseEntity nữa vì đã redirect
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Error during redirect: " + e.getMessage());
            }
        } else {
            // Nếu thanh toán không thành công, trả về kết quả
            return ResponseEntity.ok(result);
        }
    }


//    @GetMapping("/vnpay-payment")
//    public ResponseEntity<?> getPaymentStatus(HttpServletRequest request) {
//        // Xử lý kết quả thanh toán
//        int paymentStatus = checkOutService.orderReturn(request);
//
//        // Lấy thông tin thanh toán từ request
//        String orderInfo = request.getParameter("vnp_OrderInfo");
//        String paymentTime = request.getParameter("vnp_PayDate");
//        String transactionId = request.getParameter("vnp_TransactionNo");
//        String totalPrice = request.getParameter("vnp_Amount");
//
//        // Tạo đối tượng kết quả thanh toán
//        Map<String, Object> response = new HashMap<>();
//        response.put("orderId", orderInfo);
//        response.put("totalPrice", totalPrice);
//        response.put("paymentTime", paymentTime);
//        response.put("transactionId", transactionId);
//        response.put("paymentStatus", paymentStatus == 1 ? "Success" : "Fail"); // Có thể thêm thông tin trạng thái thanh toán
//
//        // Trả về ResponseEntity với status và dữ liệu JSON
//        return ResponseEntity.ok(response);
//    }

}
