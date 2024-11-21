package com.fpt.Graduation_Project_SEP490_NongSan.service.imp;

import com.fpt.Graduation_Project_SEP490_NongSan.modal.*;
import com.fpt.Graduation_Project_SEP490_NongSan.payload.request.StatusRequest;
import com.fpt.Graduation_Project_SEP490_NongSan.payload.response.OrderListItemResponse;
import com.fpt.Graduation_Project_SEP490_NongSan.payload.response.OrdersResponse;
import com.fpt.Graduation_Project_SEP490_NongSan.repository.*;
import com.fpt.Graduation_Project_SEP490_NongSan.service.OrderService;
import com.fpt.Graduation_Project_SEP490_NongSan.utils.UserUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
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
    @Autowired
    private UserRepository userRepository;

    @Override
    public List<OrdersResponse> getAllOrdersForTrader(String jwt) {
        int userId = userUtil.getUserIdFromToken();
        List<Orders> orders = ordersRepository.findByUserId(userId);
        return orders.stream()
                .map(this::mapToOrdersResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<OrdersResponse> getOrdersByIdOrderForTrader(String jwt, int idOrder) {
        int userId = userUtil.getUserIdFromToken();
        List<Orders> orders = ordersRepository.findByUserIdAndId(userId, idOrder);
        return orders.stream()
                .map(this::mapToOrdersResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<OrdersResponse> getOrdersByNameHouseHoldForTrader(String jwt, String nameHousehold) {
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
    public List<OrdersResponse> getOrdersByNameProductForTrader(String jwt, String nameProduct) {
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

    @Override
    public boolean updateOrderStatusForTrader(String jwt, StatusRequest statusRequest) {
        // Lấy ID người dùng từ JWT
        int userId = userUtil.getUserIdFromToken();

        // Tìm đơn hàng theo userId và idOrder
        List<Orders> orders = ordersRepository.findByUserIdAndId(userId, statusRequest.getIdOrder());

        // Nếu không tìm thấy đơn hàng, trả về false
        if (orders.isEmpty()) {
            return false;
        }

        // Giả sử rằng một đơn hàng chỉ có một mục trong danh sách trả về, lấy đơn hàng đầu tiên
        Orders order = orders.get(0);

        // Cập nhật trạng thái đơn hàng
        order.setStatus(statusRequest.getNameStatus());

        // Lưu đơn hàng đã cập nhật
        ordersRepository.save(order);

        // Trả về true khi cập nhật thành công
        return true;
    }

    @Override
    public boolean updateOrderStatusForHouseHold(String jwt, StatusRequest statusRequest) {
        // Lấy ID người dùng từ JWT
        int userId = userUtil.getUserIdFromToken();

        // Tìm các sản phẩm của người dùng này
        List<HouseHoldProduct> houseHoldProducts = houseHoldProductRepository.findByUserId(userId);

        // Kiểm tra nếu không tìm thấy sản phẩm của người dùng
        if (houseHoldProducts.isEmpty()) {
            return false;
        }

        // Tạo danh sách chứa các orderId liên quan đến các sản phẩm của người dùng
        List<Integer> orderIds = new ArrayList<>();

        for (HouseHoldProduct houseHoldProduct : houseHoldProducts) {
            // Lấy sản phẩm tương ứng từ bảng HouseHoldProduct
            Product product = houseHoldProduct.getProduct();

            // Tìm các đơn hàng chứa sản phẩm này
            List<OrderItem> orderItems = orderItemRepository.findByProductId(product.getId());

            // Thêm các orderId vào danh sách
            for (OrderItem orderItem : orderItems) {
                orderIds.add(orderItem.getOrders().getId());
            }
        }

        // Tìm các đơn hàng theo orderIds
        List<Orders> orders = ordersRepository.findAllById(orderIds);

        // Nếu không tìm thấy đơn hàng, trả về false
        if (orders.isEmpty()) {
            return false;
        }

        // Duyệt qua các đơn hàng và cập nhật trạng thái
        for (Orders order : orders) {
            // Cập nhật trạng thái đơn hàng
            order.setStatus(statusRequest.getNameStatus());

            // Lưu đơn hàng đã cập nhật
            ordersRepository.save(order);
        }

        // Trả về true khi cập nhật thành công
        return true;
    }

    @Override
    public List<OrdersResponse> getAllOrdersForAdmin(int totalAdminCommission) {
        // Lấy tất cả đơn hàng
        List<Orders> orders = ordersRepository.findAll();

        // Tính tổng hoa hồng của admin từ các đơn hàng
        totalAdminCommission = orders.stream()
                .mapToInt(Orders::getAdmin_commission)  // Tính tổng hoa hồng của tất cả đơn hàng
                .sum();

        // Chuyển đổi các đơn hàng sang OrdersResponse
        List<OrdersResponse> ordersResponse = orders.stream()
                .map(this::mapToOrdersResponse)
                .collect(Collectors.toList());

        // Trả về danh sách đơn hàng và tổng hoa hồng
        return ordersResponse;
    }

    @Override
    public List<OrdersResponse> getOrdersByIdOrderForAdmin(int idOrder) {
        // Tìm đơn hàng theo idOrder
        Optional<Orders> orders = ordersRepository.findById(idOrder);

        // Nếu không tìm thấy đơn hàng, trả về danh sách rỗng
        if (orders.isEmpty()) {
            return List.of();
        }

        // Chuyển đổi các đơn hàng tìm được sang OrdersResponse
        return orders.stream()
                .map(this::mapToOrdersResponse)  // Dùng phương thức mapToOrdersResponse đã có
                .collect(Collectors.toList());
    }

    @Override
    public List<OrdersResponse> getAllOrdersForHouseHold(String jwt, int totalRevenue) {
        // Lấy ID người bán từ JWT
        int userId = userUtil.getUserIdFromToken();

        // Lấy tất cả các sản phẩm thuộc hộ gia đình của người bán
        List<HouseHoldProduct> houseHoldProducts = houseHoldProductRepository.findByUserId(userId);

        if (houseHoldProducts.isEmpty()) {
            return List.of();  // Nếu người bán không có sản phẩm nào, trả về danh sách rỗng
        }

        // Lấy tất cả các đơn hàng có sản phẩm thuộc về người bán
        List<Orders> orders = houseHoldProducts.stream()
                .flatMap(houseHoldProduct -> houseHoldProduct.getProduct().getOrderItems().stream())
                .map(OrderItem::getOrders)
                .distinct()
                .collect(Collectors.toList());

        // Tính toán tổng doanh thu từ tất cả các đơn hàng có sản phẩm thuộc người bán
        totalRevenue = orders.stream()
                .flatMap(order -> order.getOrderItems().stream())
                .filter(orderItem -> houseHoldProducts.stream()
                        .anyMatch(houseHoldProduct -> houseHoldProduct.getProduct().equals(orderItem.getProduct())))
                .mapToInt(orderItem -> orderItem.getPrice() * orderItem.getQuantity())  // Tính doanh thu cho từng sản phẩm
                .sum();

        // Chuyển đổi các đơn hàng sang OrdersResponse
        List<OrdersResponse> ordersResponse = orders.stream()
                .map(this::mapToOrdersResponse)
                .collect(Collectors.toList());

        // Trả về danh sách các đơn hàng cùng với tổng doanh thu
        return ordersResponse;
    }


    @Override
    public List<OrdersResponse> getOrdersByIdOrderForHouseHold(String jwt, int idOrder) {
        // Lấy ID người bán từ JWT
        int userId = userUtil.getUserIdFromToken();

        // Lấy tất cả các sản phẩm thuộc hộ gia đình của người bán
        List<HouseHoldProduct> houseHoldProducts = houseHoldProductRepository.findByUserId(userId);

        if (houseHoldProducts.isEmpty()) {
            return List.of();  // Nếu người bán không có sản phẩm nào, trả về danh sách rỗng
        }

        // Lấy tất cả các đơn hàng có sản phẩm thuộc về người bán và có idOrder trùng với idOrder truyền vào
        List<Orders> orders = houseHoldProducts.stream()
                .flatMap(houseHoldProduct -> houseHoldProduct.getProduct().getOrderItems().stream())
                .map(OrderItem::getOrders)
                .filter(order -> order.getId() == idOrder)  // Lọc đơn hàng theo idOrder
                .distinct()
                .collect(Collectors.toList());

        // Nếu không tìm thấy đơn hàng, trả về danh sách rỗng
        if (orders.isEmpty()) {
            return List.of();
        }

        // Chuyển đổi các đơn hàng sang OrdersResponse
        return orders.stream()
                .map(this::mapToOrdersResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<OrdersResponse> getOrdersByIdProductForHouseHold(String jwt, int idProduct, int totalRevenueProduct) {
        // Lấy ID người bán từ JWT
        int userId = userUtil.getUserIdFromToken();

        // Lấy tất cả các sản phẩm thuộc hộ gia đình của người bán
        List<HouseHoldProduct> houseHoldProducts = houseHoldProductRepository.findByUserId(userId);

        // Kiểm tra nếu không có sản phẩm nào của người bán
        if (houseHoldProducts.isEmpty()) {
            return List.of();  // Nếu người bán không có sản phẩm nào, trả về danh sách rỗng
        }

        // Kiểm tra nếu sản phẩm có idProduct thuộc về người bán
        boolean isProductOwnedByUser = houseHoldProducts.stream()
                .anyMatch(houseHoldProduct -> houseHoldProduct.getProduct().getId() == idProduct);

        if (!isProductOwnedByUser) {
            return List.of(); // Nếu sản phẩm không thuộc người bán, trả về danh sách rỗng
        }

        // Tìm tất cả các đơn hàng chứa sản phẩm có idProduct
        List<Orders> orders = houseHoldProducts.stream()
                .flatMap(houseHoldProduct -> houseHoldProduct.getProduct().getOrderItems().stream())
                .filter(orderItem -> orderItem.getProduct().getId() == idProduct)  // Kiểm tra sản phẩm theo idProduct
                .map(OrderItem::getOrders)
                .distinct()
                .collect(Collectors.toList());

        // Chuyển đổi các đơn hàng thành OrdersResponse
        List<OrdersResponse> ordersResponse = orders.stream()
                .map(order -> {
                    OrdersResponse response = mapToOrdersResponse(order);
                    response.getOrderItems().forEach(orderItem ->
                            orderItem.setIdProductOrder(orderItem.getIdProductOrder()) // Thiết lập productId cho mỗi orderItem
                    );
                    return response;
                })
                .collect(Collectors.toList());

        // Tính tổng doanh thu từ sản phẩm này
        totalRevenueProduct = orders.stream()
                .flatMap(order -> order.getOrderItems().stream())
                .filter(orderItem -> orderItem.getProduct().getId() == idProduct)
                .mapToInt(orderItem -> orderItem.getPrice() * orderItem.getQuantity()) // Tính doanh thu cho sản phẩm
                .sum();

        return ordersResponse;  // Trả về danh sách các đơn hàng chứa sản phẩm idProduct
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

        ordersResponse.setNameTraderOrder(order.getUser().getFullname());

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

        orderListItemResponse.setIdProductOrder(Math.toIntExact(orderItem.getProduct().getId()));

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
