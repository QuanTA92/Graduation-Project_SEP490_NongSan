package com.fpt.Graduation_Project_SEP490_NongSan.service.imp;

import com.fpt.Graduation_Project_SEP490_NongSan.modal.*;
import com.fpt.Graduation_Project_SEP490_NongSan.payload.request.StatusRequest;
import com.fpt.Graduation_Project_SEP490_NongSan.payload.request.WithdrawalRequest;
import com.fpt.Graduation_Project_SEP490_NongSan.payload.response.OrderListItemResponse;
import com.fpt.Graduation_Project_SEP490_NongSan.payload.response.OrdersResponse;
import com.fpt.Graduation_Project_SEP490_NongSan.repository.*;
import com.fpt.Graduation_Project_SEP490_NongSan.service.OrderService;
import com.fpt.Graduation_Project_SEP490_NongSan.utils.UserUtil;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
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

    @Autowired
    private EmailService emailService;

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

        // Tìm các sản phẩm của người dùng này từ bảng HouseHoldProduct
        List<HouseHoldProduct> houseHoldProducts = houseHoldProductRepository.findByUserId(userId);

        // Kiểm tra nếu không tìm thấy sản phẩm của người dùng
        if (houseHoldProducts.isEmpty()) {
            return false;
        }

        // Lấy idOrder từ StatusRequest
        int idOrder = statusRequest.getIdOrder();

        // Tìm kiếm các OrderItems từ các sản phẩm thuộc về người dùng
        List<OrderItem> relevantOrderItems = new ArrayList<>();
        for (HouseHoldProduct houseHoldProduct : houseHoldProducts) {
            Product product = houseHoldProduct.getProduct();

            // Tìm các OrderItems có sản phẩm này
            List<OrderItem> orderItems = orderItemRepository.findByProductId(product.getId());

            // Chỉ thêm các orderItem thuộc đơn hàng có idOrder trong request
            for (OrderItem orderItem : orderItems) {
                if (orderItem.getOrders().getId() == idOrder) {
                    relevantOrderItems.add(orderItem);
                }
            }
        }

        // Nếu không tìm thấy OrderItems liên quan đến idOrder, trả về false
        if (relevantOrderItems.isEmpty()) {
            return false;
        }

        // Lấy đơn hàng từ các OrderItems đã tìm thấy
        Orders orderToUpdate = relevantOrderItems.get(0).getOrders();

        // Cập nhật trạng thái của đơn hàng
        orderToUpdate.setStatus(statusRequest.getNameStatus());

        // Lưu lại đơn hàng đã cập nhật
        ordersRepository.save(orderToUpdate);

        // Trả về true khi cập nhật thành công
        return true;
    }

    @Override
    public boolean updateOrderWithdrawalRequestForHouseHold(String jwt, WithdrawalRequest withdrawalRequest) {
        // Lấy ID người dùng từ JWT
        Long userId = (long) userUtil.getUserIdFromToken();

        // Tìm các sản phẩm thuộc sở hữu của người dùng từ bảng HouseHoldProduct
        List<HouseHoldProduct> houseHoldProducts = houseHoldProductRepository.findByUserId(Math.toIntExact(userId));

        // Kiểm tra nếu không có sản phẩm nào thuộc về người dùng
        if (houseHoldProducts.isEmpty()) {
            return false;
        }

        // Lấy idOrderItem từ WithdrawalRequest
        int idOrderItem = withdrawalRequest.getIdOrderItem();

        // Tìm OrderItem với idOrderItem từ cơ sở dữ liệu
        OrderItem orderItem = orderItemRepository.findById(idOrderItem).orElse(null);

        // Kiểm tra nếu OrderItem không tồn tại hoặc không thuộc sản phẩm của người dùng
        if (orderItem == null ||
                houseHoldProducts.stream().noneMatch(hp -> hp.getProduct().getId().equals(orderItem.getProduct().getId()))) {
            return false;
        }

        // Cập nhật yêu cầu rút tiền trong OrderItem
        orderItem.setWithdrawalRequest(withdrawalRequest.getWithdrawalRequest());

        // Lưu lại OrderItem đã cập nhật
        orderItemRepository.save(orderItem);

        // Trả về true khi cập nhật thành công
        return true;
    }


    @Override
    public boolean updateOrderWithdrawalRequestForAdmin(WithdrawalRequest withdrawalRequest) {
        // Lấy idOrderItem từ WithdrawalRequest
        int idOrderItem = withdrawalRequest.getIdOrderItem();

        // Tìm OrderItem với idOrderItem từ cơ sở dữ liệu
        OrderItem orderItem = orderItemRepository.findById(idOrderItem).orElse(null);

        // Kiểm tra nếu OrderItem không tồn tại
        if (orderItem == null) {
            return false; // Nếu không tìm thấy OrderItem, trả về false
        }

        // Cập nhật yêu cầu rút tiền
        orderItem.setWithdrawalRequest(withdrawalRequest.getWithdrawalRequest());

        // Lưu lại OrderItem đã cập nhật
        orderItemRepository.save(orderItem);

        // Gửi email chi tiết đơn hàng cho nhà cung cấp (User)
        try {
            // Lấy Product từ OrderItem
            Product product = orderItem.getProduct();

            // Tìm HouseHoldProduct dựa vào Product
            HouseHoldProduct houseHoldProduct = houseHoldProductRepository.findByProductId(product.getId());

            // Kiểm tra nếu tìm thấy HouseHoldProduct
            if (houseHoldProduct != null) {
                // Lấy User từ HouseHoldProduct (người bán)
                User seller = houseHoldProduct.getUser();

                // Gửi email chi tiết đơn hàng đến người bán
                emailService.sendDetailsOrderWithdrawalRequest(seller.getEmail(), orderItem);
            }
        } catch (MessagingException e) {
            // Xử lý lỗi nếu không thể gửi email
            e.printStackTrace();
        }

        // Trả về true khi cập nhật thành công
        return true;
    }

    @Override
    public List<OrderListItemResponse> getOrderWithdrawalRequestForHousehold(String jwt) {
        // Lấy ID người dùng từ JWT
        int userId = userUtil.getUserIdFromToken();

        // Lấy tất cả các sản phẩm thuộc hộ gia đình của người dùng
        List<HouseHoldProduct> houseHoldProducts = houseHoldProductRepository.findByUserId(userId);

        // Nếu người dùng không có sản phẩm thuộc hộ gia đình, trả về danh sách rỗng
        if (houseHoldProducts.isEmpty()) {
            return List.of();
        }

        // Lấy danh sách sản phẩm thuộc hộ gia đình của người dùng
        Set<Product> householdProducts = houseHoldProducts.stream()
                .map(HouseHoldProduct::getProduct)
                .collect(Collectors.toSet());

        // Lọc ra tất cả các đơn hàng có status là "Đã nhận hàng" và có yêu cầu rút tiền
        List<Orders> orders = ordersRepository.findAll().stream()
                .filter(order -> order.getStatus().equals("Đã nhận hàng") &&
                        order.getOrderItems().stream()
                                .anyMatch(orderItem -> householdProducts.contains(orderItem.getProduct()) &&
                                        orderItem.getWithdrawalRequest() != null && !orderItem.getWithdrawalRequest().isEmpty())) // Kiểm tra yêu cầu rút tiền
                .collect(Collectors.toList());

        // Chuyển đổi các đơn hàng thành danh sách OrderListItemResponse
        List<OrderListItemResponse> orderListItemResponses = orders.stream()
                .flatMap(order -> order.getOrderItems().stream()) // Lấy tất cả các OrderItem từ đơn hàng
                .filter(orderItem -> householdProducts.contains(orderItem.getProduct())) // Lọc các OrderItem có sản phẩm thuộc hộ gia đình
                .map(orderItem -> {
                    // Chuyển đổi OrderItem sang OrderListItemResponse
                    OrderListItemResponse orderListItemResponse = mapToOrderListItemResponse(orderItem);
                    return orderListItemResponse;
                })
                .collect(Collectors.toList());

        // Trả về danh sách các OrderListItemResponse
        return orderListItemResponses;
    }

    @Override
    public List<OrderListItemResponse> getOrderWithdrawalRequestForAdmin() {
        // Tìm tất cả các OrderItem có yêu cầu rút tiền là "Yêu cầu nhận tiền đơn hàng"
        List<OrderItem> orderItems = orderItemRepository.findByWithdrawalRequest("Yêu cầu nhận tiền đơn hàng");

        // Ánh xạ từng OrderItem sang OrderListItemResponse
        List<OrderListItemResponse> responseList = new ArrayList<>();
        for (OrderItem orderItem : orderItems) {
            OrderListItemResponse response = mapToOrderListItemResponse(orderItem);
            responseList.add(response);
        }

        // Trả về danh sách đã ánh xạ
        return responseList;
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
    public List<OrdersResponse> getOrdersByNameHouseForAdmin(String nameHousehold) {
        // Lấy tất cả các đơn hàng
        List<Orders> orders = ordersRepository.findAll();

        // Lọc các đơn hàng có sản phẩm thuộc hộ gia đình có tên chứa chuỗi nameHousehold
        List<Orders> filteredOrders = orders.stream()
                .filter(order -> order.getOrderItems().stream()
                        .anyMatch(orderItem -> {
                            Product product = orderItem.getProduct();
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
    public List<OrdersResponse> getOrdersByNameProductForAdmin(String nameProduct) {
        // Tìm các sản phẩm có tên chứa chuỗi nameProduct
        List<Product> products = productRepository.findByNameContaining(nameProduct);

        if (products.isEmpty()) {
            return List.of();  // Không tìm thấy sản phẩm phù hợp
        }

        // Lấy tất cả các đơn hàng chứa các sản phẩm này
        List<Orders> orders = products.stream()
                .flatMap(product -> product.getOrderItems().stream())
                .map(OrderItem::getOrders)
                .distinct()
                .collect(Collectors.toList());

        return orders.stream()
                .map(this::mapToOrdersResponse)
                .collect(Collectors.toList());
    }


    @Override
    public Map<String, Object> getAllOrdersForHouseHold(String jwt) {
        // Lấy ID người bán từ JWT
        int userId = userUtil.getUserIdFromToken();

        // Lấy tất cả các sản phẩm thuộc hộ gia đình của người bán
        List<HouseHoldProduct> houseHoldProducts = houseHoldProductRepository.findByUserId(userId);

        if (houseHoldProducts.isEmpty()) {
            return Map.of("orders", List.of(), "totalRevenue", 0); // Nếu không có sản phẩm nào, trả về danh sách rỗng và doanh thu là 0
        }

        // Lấy danh sách sản phẩm thuộc người bán
        Set<Product> sellerProducts = houseHoldProducts.stream()
                .map(HouseHoldProduct::getProduct)
                .collect(Collectors.toSet());

        // Lấy tất cả các đơn hàng có chứa sản phẩm thuộc về người bán
        List<Orders> orders = ordersRepository.findAll().stream()
                .filter(order -> order.getOrderItems().stream()
                        .anyMatch(orderItem -> sellerProducts.contains(orderItem.getProduct())))
                .collect(Collectors.toList());

        // Tính toán tổng doanh thu từ các sản phẩm thuộc người bán
        int totalRevenue = orders.stream()
                .flatMap(order -> order.getOrderItems().stream())
                .filter(orderItem -> sellerProducts.contains(orderItem.getProduct()))
                .mapToInt(orderItem -> orderItem.getPrice() * orderItem.getQuantity()) // Nhân giá và số lượng
                .sum();

        // Chuyển đổi các đơn hàng sang OrdersResponse
        List<OrdersResponse> ordersResponse = orders.stream()
                .map(order -> {
                    // Lọc lại các orderItems chỉ thuộc về sellerProducts
                    order.setOrderItems(order.getOrderItems().stream()
                            .filter(orderItem -> sellerProducts.contains(orderItem.getProduct()))
                            .collect(Collectors.toList()));
                    return mapToOrdersResponse(order);
                })
                .collect(Collectors.toList());

        // Trả về danh sách các đơn hàng và tổng doanh thu
        return Map.of("orders", ordersResponse, "totalRevenue", totalRevenue);
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
    public Map<String, Object> getOrdersByIdProductForHouseHold(String jwt, int idProduct, int totalRevenueProduct) {
        // Lấy ID người bán từ JWT
        int userId = userUtil.getUserIdFromToken();

        // Lấy tất cả các sản phẩm thuộc hộ gia đình của người bán
        List<HouseHoldProduct> houseHoldProducts = houseHoldProductRepository.findByUserId(userId);

        // Kiểm tra nếu không có sản phẩm nào của người bán
        if (houseHoldProducts.isEmpty()) {
            return Map.of("orders", List.of(), "totalRevenueProduct", 0);  // Nếu người bán không có sản phẩm nào, trả về danh sách rỗng và doanh thu là 0
        }

        // Lọc sản phẩm của người bán có idProduct
        Set<Product> sellerProducts = houseHoldProducts.stream()
                .map(HouseHoldProduct::getProduct)
                .filter(product -> product.getId() == idProduct)
                .collect(Collectors.toSet());

        // Nếu không tìm thấy sản phẩm nào với idProduct
        if (sellerProducts.isEmpty()) {
            return Map.of("orders", List.of(), "totalRevenueProduct", 0);  // Nếu không có sản phẩm phù hợp, trả về danh sách rỗng và doanh thu là 0
        }

        // Lấy tất cả các đơn hàng chứa sản phẩm có idProduct và thuộc người bán
        List<Orders> orders = ordersRepository.findAll().stream()
                .filter(order -> order.getOrderItems().stream()
                        .anyMatch(orderItem -> sellerProducts.contains(orderItem.getProduct())))  // Lọc đơn hàng có chứa sản phẩm thuộc sellerProducts
                .collect(Collectors.toList());

        // Tính toán tổng doanh thu từ các sản phẩm này
        totalRevenueProduct = orders.stream()
                .flatMap(order -> order.getOrderItems().stream())
                .filter(orderItem -> sellerProducts.contains(orderItem.getProduct()))  // Lọc orderItems thuộc sản phẩm có idProduct
                .mapToInt(orderItem -> orderItem.getPrice() * orderItem.getQuantity())  // Nhân giá với số lượng
                .sum();

        // Chuyển đổi các đơn hàng sang OrdersResponse
        List<OrdersResponse> ordersResponse = orders.stream()
                .map(order -> {
                    // Lọc lại các orderItems chỉ thuộc về sellerProducts
                    order.setOrderItems(order.getOrderItems().stream()
                            .filter(orderItem -> sellerProducts.contains(orderItem.getProduct()))
                            .collect(Collectors.toList()));
                    return mapToOrdersResponse(order);
                })
                .collect(Collectors.toList());

        // Trả về danh sách các đơn hàng và tổng doanh thu
        return Map.of("orders", ordersResponse, "totalRevenueProduct", totalRevenueProduct);
    }


    @Override
    public Map<String, Object> getOrdersByNameProductForHouseHold(String jwt, String nameProduct, int totalRevenueProduct) {
        // Lấy ID người bán từ JWT
        int userId = userUtil.getUserIdFromToken();

        // Lấy tất cả các sản phẩm thuộc hộ gia đình của người bán
        List<HouseHoldProduct> houseHoldProducts = houseHoldProductRepository.findByUserId(userId);

        // Kiểm tra nếu không có sản phẩm nào của người bán
        if (houseHoldProducts.isEmpty()) {
            return Map.of("orders", List.of(), "totalRevenueProduct", 0);  // Nếu không có sản phẩm nào, trả về danh sách rỗng và doanh thu là 0
        }

        // Lọc các sản phẩm có tên chứa chuỗi nameProduct trong các sản phẩm của người bán
        Set<Product> sellerProducts = houseHoldProducts.stream()
                .map(HouseHoldProduct::getProduct)
                .filter(product -> product.getName().toLowerCase().contains(nameProduct.toLowerCase()))
                .collect(Collectors.toSet());

        // Nếu không tìm thấy sản phẩm nào phù hợp
        if (sellerProducts.isEmpty()) {
            return Map.of("orders", List.of(), "totalRevenueProduct", 0);  // Không tìm thấy sản phẩm phù hợp
        }

        // Lấy tất cả các đơn hàng chứa sản phẩm thuộc về người bán
        List<Orders> orders = ordersRepository.findAll().stream()
                .filter(order -> order.getOrderItems().stream()
                        .anyMatch(orderItem -> sellerProducts.contains(orderItem.getProduct())))
                .collect(Collectors.toList());

        // Tính toán tổng doanh thu từ các sản phẩm này
        totalRevenueProduct = orders.stream()
                .flatMap(order -> order.getOrderItems().stream())
                .filter(orderItem -> sellerProducts.contains(orderItem.getProduct()))
                .mapToInt(orderItem -> orderItem.getPrice() * orderItem.getQuantity())  // Nhân giá và số lượng
                .sum();

        // Chuyển đổi các đơn hàng sang OrdersResponse
        List<OrdersResponse> ordersResponse = orders.stream()
                .map(order -> {
                    // Lọc lại các orderItems chỉ thuộc về sellerProducts
                    order.setOrderItems(order.getOrderItems().stream()
                            .filter(orderItem -> sellerProducts.contains(orderItem.getProduct()))
                            .collect(Collectors.toList()));
                    return mapToOrdersResponse(order);
                })
                .collect(Collectors.toList());

        // Trả về danh sách các đơn hàng và tổng doanh thu
        return Map.of("orders", ordersResponse, "totalRevenueProduct", totalRevenueProduct);
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

        orderListItemResponse.setSpecificAddressProduct(orderItem.getProduct().getAddress().getSpecificAddress());
        orderListItemResponse.setWardProduct(orderItem.getProduct().getAddress().getWard());
        orderListItemResponse.setDistrictProduct(orderItem.getProduct().getAddress().getDistrict());
        orderListItemResponse.setCityProduct(orderItem.getProduct().getAddress().getCity());

        orderListItemResponse.setWithdrawalRequestProduct(orderItem.getWithdrawalRequest());
        // Lấy danh sách các sản phẩm hộ gia đình từ sản phẩm của orderItem
        List<HouseHoldProduct> houseHoldProducts = orderItem.getProduct().getHouseHoldProducts();

        if (!houseHoldProducts.isEmpty()) {
            // Giả sử rằng chỉ có một hộ gia đình sở hữu sản phẩm, lấy tên của người dùng hộ gia đình đầu tiên
            orderListItemResponse.setNameHouseholdProduct(houseHoldProducts.get(0).getUser().getFullname());
            orderListItemResponse.setPhoneNumberHouseholdProduct(houseHoldProducts.get(0).getUser().getUserDetails().getPhone());
        } else {
            orderListItemResponse.setNameHouseholdProduct("N/A"); // Nếu không có hộ gia đình nào, dùng "N/A"
            orderListItemResponse.setPhoneNumberHouseholdProduct("N/A");
        }
        return orderListItemResponse;
    }
}