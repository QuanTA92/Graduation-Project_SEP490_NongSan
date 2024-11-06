package com.fpt.Graduation_Project_SEP490_NongSan.service.imp;

import com.fpt.Graduation_Project_SEP490_NongSan.modal.HouseHoldProduct;
import com.fpt.Graduation_Project_SEP490_NongSan.modal.OrderItem;
import com.fpt.Graduation_Project_SEP490_NongSan.modal.Orders;
import com.fpt.Graduation_Project_SEP490_NongSan.modal.Product;
import com.fpt.Graduation_Project_SEP490_NongSan.payload.response.OrderListItemResponse;
import com.fpt.Graduation_Project_SEP490_NongSan.payload.response.OrdersResponse;
import com.fpt.Graduation_Project_SEP490_NongSan.repository.HouseHoldProductRepository;
import com.fpt.Graduation_Project_SEP490_NongSan.repository.OrderItemRepository;
import com.fpt.Graduation_Project_SEP490_NongSan.repository.OrdersRepository;
import com.fpt.Graduation_Project_SEP490_NongSan.repository.ProductRepository;
import com.fpt.Graduation_Project_SEP490_NongSan.service.OrderService;
import com.fpt.Graduation_Project_SEP490_NongSan.utils.UserUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrdersRepository ordersRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private HouseHoldProductRepository houseHoldProductRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserUtil userUtil;

    @Override
    public List<OrdersResponse> getAllOrders(String jwt) {
        int userId = userUtil.getUserIdFromToken();
        List<Orders> orders = ordersRepository.findByUserId(userId);
        return orders.stream()
                .map(this::mapToOrdersResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<OrdersResponse> getOrdersByIdOrder(String jwt, int idOrder) {
        int userId = userUtil.getUserIdFromToken();
        List<Orders> orders = ordersRepository.findByUserIdAndId(userId, idOrder);
        return orders.stream()
                .map(this::mapToOrdersResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<OrdersResponse> getOrdersByNameHouseHold(String jwt, String nameHousehold) {
        int userId = userUtil.getUserIdFromToken();

        // Lấy tất cả các đơn hàng của người mua
        List<Orders> orders = ordersRepository.findByUserId(userId);

        // Tìm các đơn hàng có sản phẩm thuộc hộ gia đình có tên chứa chuỗi nameHousehold
        List<Orders> filteredOrders = orders.stream()
                .filter(order -> order.getOrderItems().stream()
                        .anyMatch(orderItem -> {
                            Product product = orderItem.getProduct();
                            // Kiểm tra nếu sản phẩm thuộc hộ gia đình của người bán có fullname chứa chuỗi nameHousehold
                            List<HouseHoldProduct> houseHoldProducts = product.getHouseHoldProducts();
                            return houseHoldProducts.stream()
                                    .anyMatch(houseHoldProduct ->
                                            houseHoldProduct.getUser().getFullname().toLowerCase().contains(nameHousehold.toLowerCase())
                                    );
                        }))
                .collect(Collectors.toList());

        if (filteredOrders.isEmpty()) {
            return List.of();  // Không tìm thấy đơn hàng phù hợp
        }

        return filteredOrders.stream()
                .map(this::mapToOrdersResponse)
                .collect(Collectors.toList());
    }


    @Override
    public List<OrdersResponse> getOrdersByNameProduct(String jwt, String nameProduct) {
        int userId = userUtil.getUserIdFromToken();

        // Find products matching the product name
        List<Product> products = productRepository.findByNameContaining(nameProduct);

        if (products.isEmpty()) {
            return List.of();  // No products found for the given name
        }

        // Find orders that contain these products
        List<Orders> orders = products.stream()
                .flatMap(product -> product.getOrderItems().stream())
                .map(OrderItem::getOrders)
                .distinct()
                .collect(Collectors.toList());

        // Map orders to OrdersResponse
        return orders.stream()
                .map(this::mapToOrdersResponse)
                .collect(Collectors.toList());
    }

    // Helper method to map Orders to OrdersResponse
    private OrdersResponse mapToOrdersResponse(Orders order) {
        OrdersResponse ordersResponse = new OrdersResponse();
        ordersResponse.setIdOrderProduct(order.getId());
        ordersResponse.setAmountPaidOrderProduct(order.getAmount_paid());
        ordersResponse.setAdminCommissionOrderProduct(order.getAdmin_commission());
        ordersResponse.setStatusOrderProduct(order.getStatus());
        ordersResponse.setTransferContentOrderProduct(order.getTransferContent());
        ordersResponse.setCreateDate(order.getCreateDate());

        // Map the order items for each order
        List<OrderListItemResponse> orderItemsResponse = order.getOrderItems().stream()
                .map(this::mapToOrderListItemResponse)
                .collect(Collectors.toList());
        ordersResponse.setOrderItems(orderItemsResponse);

        return ordersResponse;
    }

    // Helper method to map OrderItem to OrderListItemResponse
    private OrderListItemResponse mapToOrderListItemResponse(OrderItem orderItem) {
        OrderListItemResponse orderListItemResponse = new OrderListItemResponse();
        orderListItemResponse.setIdItemProduct(orderItem.getId());
        orderListItemResponse.setPriceOrderProduct(orderItem.getPrice());
        orderListItemResponse.setQuantityOrderProduct(orderItem.getQuantity());
        orderListItemResponse.setProductName(orderItem.getProduct().getName());

        // Lấy danh sách các sản phẩm hộ gia đình từ sản phẩm của orderItem
        List<HouseHoldProduct> houseHoldProducts = orderItem.getProduct().getHouseHoldProducts();

        if (!houseHoldProducts.isEmpty()) {
            // Giả sử rằng chỉ có một hộ gia đình sở hữu sản phẩm, lấy tên của người dùng hộ gia đình đầu tiên
            orderListItemResponse.setNameHouseholdProduct(houseHoldProducts.get(0).getUser().getFullname());
        } else {
            orderListItemResponse.setNameHouseholdProduct("N/A"); // Nếu không có hộ gia đình nào, dùng "N/A"
        }

        return orderListItemResponse;
    }

}
