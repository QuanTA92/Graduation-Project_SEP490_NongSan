package com.fpt.Graduation_Project_SEP490_NongSan.controller;

import com.fpt.Graduation_Project_SEP490_NongSan.payload.response.OrdersResponse;
import com.fpt.Graduation_Project_SEP490_NongSan.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    // Endpoint to get all orders
    @GetMapping("/get")
    public ResponseEntity<?> getAllOrders(@RequestHeader("Authorization") String jwt) {
        try {
            // Calling the service method to get all orders
            List<OrdersResponse> ordersResponse = orderService.getAllOrders(jwt);

            // If there are no orders, return a 404 Not Found status
            if (ordersResponse.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No orders found.");
            }

            // Return the list of orders with a 200 OK status
            return ResponseEntity.ok(ordersResponse);
        } catch (Exception e) {
            // Handle any exceptions and return a 500 Internal Server Error
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while fetching orders.");
        }
    }

    // Endpoint to get orders by a specific order ID
    @GetMapping("/get/{idOrder}")
    public ResponseEntity<?> getOrdersByIdOrder(@RequestHeader("Authorization") String jwt, @PathVariable int idOrder) {
        try {
            // Calling the service method to get orders by ID
            List<OrdersResponse> ordersResponse = orderService.getOrdersByIdOrder(jwt, idOrder);

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
    @GetMapping("/get/nameHouseHold")
    public ResponseEntity<?> getOrdersByNameHouseHold(@RequestHeader("Authorization") String jwt, @RequestParam String nameHousehold) {
        try {
            // Calling the service method to get orders by household name
            List<OrdersResponse> ordersResponse = orderService.getOrdersByNameHouseHold(jwt, nameHousehold);

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
    @GetMapping("/get/nameProduct")
    public ResponseEntity<?> getOrdersByNameProduct(@RequestHeader("Authorization") String jwt, @RequestParam String nameProduct) {
        try {
            // Calling the service method to get orders by product name
            List<OrdersResponse> ordersResponse = orderService.getOrdersByNameProduct(jwt, nameProduct);

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
}
