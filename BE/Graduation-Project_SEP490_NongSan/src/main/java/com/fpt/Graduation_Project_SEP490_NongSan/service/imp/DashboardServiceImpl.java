package com.fpt.Graduation_Project_SEP490_NongSan.service.imp;

import com.fpt.Graduation_Project_SEP490_NongSan.modal.HouseHoldProduct;
import com.fpt.Graduation_Project_SEP490_NongSan.modal.OrderItem;
import com.fpt.Graduation_Project_SEP490_NongSan.modal.Orders;
import com.fpt.Graduation_Project_SEP490_NongSan.payload.response.DashboardAdminResponse;
import com.fpt.Graduation_Project_SEP490_NongSan.payload.response.DashboardHouseHoldResponse;
import com.fpt.Graduation_Project_SEP490_NongSan.repository.HouseHoldProductRepository;
import com.fpt.Graduation_Project_SEP490_NongSan.repository.OrdersRepository;
import com.fpt.Graduation_Project_SEP490_NongSan.repository.ProductRepository;
import com.fpt.Graduation_Project_SEP490_NongSan.repository.UserRepository;
import com.fpt.Graduation_Project_SEP490_NongSan.service.DashboardService;
import com.fpt.Graduation_Project_SEP490_NongSan.utils.UserUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardServiceImpl implements DashboardService {

    @Autowired
    private OrdersRepository ordersRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private HouseHoldProductRepository houseHoldProductRepository;

    @Autowired
    private UserUtil userUtil;

    @Override
    public DashboardAdminResponse getDashboardAdmin() {
        DashboardAdminResponse response = new DashboardAdminResponse();

        // Lấy tổng admin commission
        int totalAdminCommission = ordersRepository.sumAdminCommission();
        response.setTotalAdminCommission(totalAdminCommission);

        // Lấy tổng số lượng tài khoản
        int totalAccount = (int) userRepository.count();
        response.setTotalAccount(totalAccount);

        // Lấy tổng số sản phẩm còn hàng (quantity > 0)
        int totalProductInWeb = productRepository.countByQuantityGreaterThan(0);
        response.setTotalProductInWeb(totalProductInWeb);

        // Lấy tổng số đơn hàng
        int totalOrders = (int) ordersRepository.count();
        response.setTotalOrders(totalOrders);

        response.setCreateDate(new Date());

        return response;
    }

    @Override
    public DashboardHouseHoldResponse getDashboardHouseHold(String jwt) {
        // Lấy userId từ JWT
        int userId = userUtil.getUserIdFromToken();

        // Khởi tạo đối tượng trả về
        DashboardHouseHoldResponse response = new DashboardHouseHoldResponse();

        // Tính tổng doanh thu (totalRevenue)
        int totalRevenue = 0;

        // Lấy tất cả các sản phẩm thuộc hộ gia đình của người bán
        List<HouseHoldProduct> houseHoldProducts = houseHoldProductRepository.findByUserId(userId);

        // Nếu không có sản phẩm nào, trả về doanh thu bằng 0
        if (houseHoldProducts.isEmpty()) {
            response.setTotalRevenue(totalRevenue);
            response.setCurrentProductsForSale(0);
            response.setTotalQuantityOfProductsCurrentlyForSale(0);
            response.setSoldOutProducts(0);
            response.setCreateDate(new Date());
            return response;
        }

        // Tính tổng doanh thu từ tất cả các đơn hàng có sản phẩm thuộc người bán
        List<Orders> orders = houseHoldProducts.stream()
                .flatMap(houseHoldProduct -> houseHoldProduct.getProduct().getOrderItems().stream())
                .map(OrderItem::getOrders)
                .distinct()
                .collect(Collectors.toList());

        // Tính toán tổng doanh thu từ các đơn hàng này
        totalRevenue = orders.stream()
                .flatMap(order -> order.getOrderItems().stream())
                .filter(orderItem -> houseHoldProducts.stream()
                        .anyMatch(houseHoldProduct -> houseHoldProduct.getProduct().equals(orderItem.getProduct())))
                .mapToInt(orderItem -> orderItem.getPrice() * orderItem.getQuantity())  // Tính doanh thu cho từng sản phẩm
                .sum();

        response.setTotalRevenue(totalRevenue);

        // Tính số sản phẩm đang bán và tổng số lượng sản phẩm đang bán
        int currentProductsForSale = (int) houseHoldProducts.stream()
                .filter(houseHoldProduct -> houseHoldProduct.getProduct().getQuantity() > 0)
                .count();

        int totalQuantityOfProductsCurrentlyForSale = houseHoldProducts.stream()
                .filter(houseHoldProduct -> houseHoldProduct.getProduct().getQuantity() > 0)
                .mapToInt(houseHoldProduct -> houseHoldProduct.getProduct().getQuantity())
                .sum();

        response.setCurrentProductsForSale(currentProductsForSale);
        response.setTotalQuantityOfProductsCurrentlyForSale(totalQuantityOfProductsCurrentlyForSale);

        // Tính số sản phẩm đã bán hết
        int soldOutProducts = (int) houseHoldProducts.stream()
                .filter(houseHoldProduct -> houseHoldProduct.getProduct().getQuantity() == 0)
                .count();

        response.setSoldOutProducts(soldOutProducts);

        // Set thời gian tạo dữ liệu
        response.setCreateDate(new Date());

        return response;
    }
}
