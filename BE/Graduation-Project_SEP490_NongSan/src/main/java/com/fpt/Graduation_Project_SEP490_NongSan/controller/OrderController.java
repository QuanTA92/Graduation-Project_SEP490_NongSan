package com.fpt.Graduation_Project_SEP490_NongSan.controller;

import com.fpt.Graduation_Project_SEP490_NongSan.payload.request.StatusRequest;
import com.fpt.Graduation_Project_SEP490_NongSan.payload.response.OrdersResponse;
import com.fpt.Graduation_Project_SEP490_NongSan.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    // Endpoint to get all orders
    @GetMapping("/trader/get")
    public ResponseEntity<?> getAllOrdersOfTrader(@RequestHeader("Authorization") String jwt) {
        try {
            // Calling the service method to get all orders
            List<OrdersResponse> ordersResponse = orderService.getAllOrdersForTrader(jwt);

            // If there are no orders, return a 404 Not Found status
            if (ordersResponse.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No orders found Of Trader.");
            }

            // Return the list of orders with a 200 OK status
            return ResponseEntity.ok(ordersResponse);
        } catch (Exception e) {
            // Handle any exceptions and return a 500 Internal Server Error
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while fetching orders.");
        }
    }

    // Endpoint to get orders by a specific order ID
    @GetMapping("/trader/get/{idOrder}")
    public ResponseEntity<?> getOrdersByIdOrderOfTrader(@RequestHeader("Authorization") String jwt, @PathVariable int idOrder) {
        try {
            // Calling the service method to get orders by ID
            List<OrdersResponse> ordersResponse = orderService.getOrdersByIdOrderForTrader(jwt, idOrder);

            // If no orders found for the given ID, return a 404 Not Found status
            if (ordersResponse.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No orders found with the given ID.");
            }

            // Return the list of orders with a 200 OK status
            return ResponseEntity.ok(ordersResponse);
        } catch (Exception e) {
            // Handle any exceptions and return a 500 Internal Server Error
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while fetching the order.");
        }
    }

    // Endpoint to get orders by household name
    @GetMapping("/trader/get/getByNameHouseHold")
    public ResponseEntity<?> getOrdersByNameHouseHold(@RequestHeader("Authorization") String jwt, @RequestParam String nameHousehold) {
        try {
            // Calling the service method to get orders by household name
            List<OrdersResponse> ordersResponse = orderService.getOrdersByNameHouseHoldForTrader(jwt, nameHousehold);

            // If no orders found for the given household name, return a 404 Not Found status
            if (ordersResponse.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No orders found for the given household name.");
            }

            // Return the list of orders with a 200 OK status
            return ResponseEntity.ok(ordersResponse);
        } catch (Exception e) {
            // Handle any exceptions and return a 500 Internal Server Error
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while fetching orders by household name.");
        }
    }

    // Endpoint to get orders by product name
    @GetMapping("/trader/get/getByNameProduct")
    public ResponseEntity<?> getOrdersByNameProduct(@RequestHeader("Authorization") String jwt, @RequestParam String nameProduct) {
        try {
            // Calling the service method to get orders by product name
            List<OrdersResponse> ordersResponse = orderService.getOrdersByNameProductForTrader(jwt, nameProduct);

            // If no orders found for the given product name, return a 404 Not Found status
            if (ordersResponse.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No orders found for the given product name.");
            }

            // Return the list of orders with a 200 OK status
            return ResponseEntity.ok(ordersResponse);
        } catch (Exception e) {
            // Handle any exceptions and return a 500 Internal Server Error
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while fetching orders by product name.");
        }
    }

    @PutMapping("/trader/update/status")
    public ResponseEntity<?> updateOrderStatus(@RequestHeader("Authorization") String jwt, @RequestBody StatusRequest statusRequest) {
        try {
            // Set the ID of the order in the statusRequest
            statusRequest.setIdOrder(statusRequest.getIdOrder());

            // Call the service to update the order status
            boolean isUpdated = orderService.updateOrderStatusForTrader(jwt, statusRequest);

            // If the update was successful, return a 200 OK status
            if (isUpdated) {
                return ResponseEntity.ok("Order status updated successfully.");
            }

            // If the update failed, return a 404 Not Found status
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order not found or update failed.");
        } catch (Exception e) {
            // Handle any exceptions and return a 500 Internal Server Error
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while updating the order status.");
        }
    }

    // Endpoint to get all orders for admin
    @GetMapping("/admin/get")
    public ResponseEntity<?> getAllOrdersForAdmin() {
        try {
            // Gọi service để lấy tất cả các đơn hàng
            List<OrdersResponse> ordersResponse = orderService.getAllOrdersForAdmin(0); // Lấy danh sách đơn hàng
            int totalAdminCommission = ordersResponse.stream()
                    .mapToInt(OrdersResponse::getAdminCommissionOrderProduct)  // Tính tổng hoa hồng từ OrdersResponse
                    .sum();

            // Kiểm tra nếu không có đơn hàng nào, trả về 404
            if (ordersResponse.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No orders found for admin.");
            }

            // Tạo đối tượng chứa cả tổng hoa hồng và danh sách đơn hàng
            var result = new HashMap<String, Object>();
            result.put("totalAdminCommission", totalAdminCommission);
            result.put("orders", ordersResponse);

            // Trả về đối tượng chứa tổng hoa hồng và đơn hàng với mã trạng thái 200 OK
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            // Xử lý lỗi và trả về 500 Internal Server Error nếu có lỗi
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while fetching orders for admin.");
        }
    }


    @GetMapping("/admin/get/{idOrder}")
    public ResponseEntity<?> getOrderByIdForAdmin(@PathVariable int idOrder) {
        try {
            // Gọi service để lấy đơn hàng theo idOrder
            List<OrdersResponse> ordersResponse = orderService.getOrdersByIdOrderForAdmin(idOrder);

            // Kiểm tra nếu không có đơn hàng nào, trả về 404
            if (ordersResponse.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order not found.");
            }

            // Trả về danh sách đơn hàng với mã trạng thái 200 OK
            return ResponseEntity.ok(ordersResponse);
        } catch (Exception e) {
            // Xử lý lỗi và trả về 500 Internal Server Error nếu có lỗi
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while fetching the order.");
        }
    }

    @GetMapping("/household/get")
    public ResponseEntity<?> getAllOrdersForHouseHold(@RequestHeader("Authorization") String jwt) {
        try {
            // Gọi phương thức trong service để lấy danh sách đơn hàng
            List<OrdersResponse> ordersResponse = orderService.getAllOrdersForHouseHold(jwt, 0);

            // Kiểm tra nếu không có đơn hàng nào
            if (ordersResponse.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy đơn hàng cho người bán.");
            }

            // Tính tổng doanh thu (totalRevenue) từ các đơn hàng
            int totalRevenue = ordersResponse.stream()
                    .flatMap(order -> order.getOrderItems().stream())
                    .mapToInt(orderItem -> orderItem.getPriceOrderProduct() * orderItem.getQuantityOrderProduct())
                    .sum();

            // Trả về danh sách đơn hàng và tổng doanh thu với mã trạng thái OK
            return ResponseEntity.ok(Map.of("orders", ordersResponse, "totalRevenue", totalRevenue));

        } catch (Exception e) {
            // Xử lý lỗi chung
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Đã xảy ra lỗi trong quá trình lấy đơn hàng.");
        }
    }

    @GetMapping("/household/get/order/{idOrder}")
    public ResponseEntity<?> getOrderByIdForHouseHold(@PathVariable int idOrder, @RequestHeader("Authorization") String jwt) {
        try {
            // Gọi phương thức trong service để lấy đơn hàng theo ID
            List<OrdersResponse> ordersResponse = orderService.getOrdersByIdOrderForHouseHold(jwt, idOrder);

            // Kiểm tra nếu không có đơn hàng với idOrder
            if (ordersResponse.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy đơn hàng với ID " + idOrder);
            }

            // Trả về đơn hàng với mã trạng thái OK
            return ResponseEntity.ok(ordersResponse);
        } catch (Exception e) {
            // Xử lý lỗi chung
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Đã xảy ra lỗi trong quá trình lấy đơn hàng.");
        }
    }

    @GetMapping("/household/get/product/{idProduct}")
    public ResponseEntity<?> getOrdersByIdProductForHouseHold(@PathVariable int idProduct, @RequestHeader("Authorization") String jwt) {
        try {
            // Gọi phương thức trong service để lấy danh sách đơn hàng và tính tổng doanh thu
            List<OrdersResponse> ordersResponse = orderService.getOrdersByIdProductForHouseHold(jwt, idProduct, 0);

            // Kiểm tra nếu không có đơn hàng nào cho sản phẩm này
            if (ordersResponse.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy đơn hàng cho sản phẩm này.");
            }

            // Tính tổng doanh thu cho sản phẩm idProduct
            int totalRevenueProduct = ordersResponse.stream()
                    .flatMap(order -> order.getOrderItems().stream())
                    .filter(orderItem -> orderItem.getIdProductOrder() == idProduct)  // So sánh với idProduct
                    .mapToInt(orderItem -> orderItem.getPriceOrderProduct() * orderItem.getQuantityOrderProduct())
                    .sum();

            // Trả về danh sách đơn hàng và tổng doanh thu cho sản phẩm
            return ResponseEntity.ok(Map.of( "totalRevenueProduct", totalRevenueProduct, "orders", ordersResponse));

        } catch (Exception e) {
            // Xử lý lỗi
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Đã xảy ra lỗi khi lấy đơn hàng.");
        }
    }








}


