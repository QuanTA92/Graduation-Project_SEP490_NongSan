import React, { useState, useEffect } from "react";
import axios from "axios";

const FindOrderById = () => {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [visibleDetails, setVisibleDetails] = useState({});
  const token = localStorage.getItem("token");
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const axiosInstance = axios.create({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const apiBase = "http://localhost:8080/api/product/household/get";
  const orderApiBase = "http://localhost:8080/api/orders/household/get/product/";

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(apiBase);
      setProducts(response.data);
    } catch (error) {
      setError("Failed to fetch products");
    }
    setLoading(false);
  };

  const fetchOrderDetails = async (productId) => {
    setLoading(true);
    setError(null);
    setOrderData(null); // Reset data before calling API
    try {
      const response = await axiosInstance.get(`${orderApiBase}${productId}`);
      if (response.data.orders && response.data.orders.length > 0) {
        setOrderData(response.data);
        setTotalRevenue(response.data.totalRevenueProduct);
      } else {
        setOrderData({ orders: [] }); // Return empty structure if no orders
        setTotalRevenue(0); // Set revenue to 0
      }
    } catch (error) {
      setError("Không có đơn đặt hàng nào cho sản phẩm này.");
      setTotalRevenue(0);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleProductSelect = (e) => {
    const selectedId = e.target.value;
    setSelectedProductId(selectedId);
    if (selectedId) {
      fetchOrderDetails(selectedId);
    } else {
      setOrderData(null);
    }
  };

  const toggleDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailsModal(false);
    setSelectedOrder(null);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Tìm Kiếm Đơn Hàng Theo Sản Phẩm</h1>

      <div style={styles.revenueContainer}>
        <p style={styles.revenueText}>
          Tổng Doanh Thu: {totalRevenue.toLocaleString()} VNĐ
        </p>
      </div>

      {loading && <p style={styles.loadingText}>Đang tải...</p>}
      {error && <p style={styles.errorText}>{error}</p>}

      <div style={styles.selectContainer}>
        <label>Chọn Sản Phẩm: </label>
        <select
          value={selectedProductId || ""}
          onChange={handleProductSelect}
          style={styles.input}
        >
          <option value="">Chọn sản phẩm</option>
          {products.map((product) => (
            <option key={product.idProduct} value={product.idProduct}>
              {product.nameProduct}
            </option>
          ))}
        </select>
      </div>

      {orderData ? (
        orderData.orders && orderData.orders.length > 0 ? (
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.tableHeader}>ID</th>
                  <th style={styles.tableHeader}>Người mua</th>
                  <th style={styles.tableHeader}>Tên sản phẩm</th> {/* Thêm cột này */}
                  <th style={styles.tableHeader}>Trạng thái</th>
                  <th style={styles.tableHeader}>Nội dung thanh toán</th>
                  <th style={styles.tableHeader}>Ngày tạo</th>
                  <th style={styles.tableHeader}>Chi tiết sản phẩm</th>
                </tr>
              </thead>
              <tbody>
                {orderData.orders.map((order) => (
                  <tr key={order.idOrderProduct} style={styles.tableRow}>
                    <td style={styles.tableCell}>{order.idOrderProduct}</td>
                    <td style={styles.tableCell}>{order.nameTraderOrder}</td>
                    <td style={styles.tableCell}>
        {order.orderItems.map((item) => item.productName).join(", ")} {/* Hiển thị tên sản phẩm */}
      </td>
                    <td style={styles.tableCell}>{order.statusOrderProduct}</td>
                    <td style={styles.tableCell}>
                      {order.transferContentOrderProduct}
                    </td>
                    <td style={styles.tableCell}>{order.createDate}</td>
                    <td style={styles.tableCell}>
                      <button
                        style={styles.toggleButton}
                        onClick={() => toggleDetails(order)}
                      >
                        👁️Xem chi tiết
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={styles.noOrderText}>Không có đơn đặt hàng nào về sản phẩm này.</p>
        )
      ) : null}

      {showDetailsModal && selectedOrder && (
        <ProductDetailsModal
          product={selectedOrder}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

const ProductDetailsModal = ({ product, onClose }) => {
  return (
    <div style={styles.popupOverlay}>
      <div style={styles.popupContent}>
        <h2 style={styles.popupTitle}>Chi Tiết Sản Phẩm</h2>
        {product ? (
          <table style={styles.popupTable}>
            <tbody>
              {product.orderItems.map((item) => (
                <>
                  <tr key={item.idItemProduct}>
                    <td style={styles.popupLabel}>Tên:</td>
                    <td style={styles.popupValue}>{item.productName}</td>
                  </tr>
                  <tr key={item.idItemProduct}>
                    <td style={styles.popupLabel}>Giá:</td>
                    <td style={styles.popupValue}>{item.priceOrderProduct.toLocaleString()} VND</td>
                  </tr>
                  <tr key={item.idItemProduct}>
                    <td style={styles.popupLabel}>Số lượng:</td>
                    <td style={styles.popupValue}>{item.quantityOrderProduct}</td>
                  </tr>
                  <tr key={item.idItemProduct}>
                    <td style={styles.popupLabel}>Nhà cung cấp:</td>
                    <td style={styles.popupValue}>{item.nameHouseholdProduct}</td>
                  </tr>
                  <tr key={item.idItemProduct}>
                    <td style={styles.popupLabel}>Điện thoại:</td>
                    <td style={styles.popupValue}>{item.phoneNumberHouseholdProduct}</td>
                  </tr>
                  <tr key={item.idItemProduct}>
                    <td style={styles.popupLabel}>Địa chỉ:</td>
                    <td style={styles.popupValue}>
                      {item.specificAddressProduct}, {item.wardProduct}, {item.districtProduct}, {item.cityProduct}
                    </td>
                  </tr>
                </>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Không có thông tin chi tiết cho sản phẩm này.</p>
        )}
        <button onClick={onClose} style={styles.closeButton}>Đóng</button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    fontFamily: "'Roboto', sans-serif",
    backgroundColor: "#f9fff4",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  },
  title: {
    textAlign: "center",
    color: "#2e7d32",
    fontSize: "24px",
    marginBottom: "20px",
    fontWeight: "bold",
  },
  revenueContainer: {
    textAlign: "center",
    marginBottom: "20px",
  },
  revenueText: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#388e3c",
  },
  selectContainer: {
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  tableContainer: {
    marginTop: "20px",
    backgroundColor: "#fff",
    padding: "15px",
    borderRadius: "8px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  tableHeader: {
    backgroundColor: "#388e3c",
    color: "#fff",
    padding: "10px",
    textAlign: "left",
    fontWeight: "bold",
  },
  tableRow: {
    borderBottom: "1px solid #ddd",
    transition: "background-color 0.3s ease",
  },
  tableCell: {
    padding: "10px",
    textAlign: "left",
    fontSize: "14px",
    color: "#333",
  },
  toggleButton: {
    padding: "5px 10px",
    margin: "5px 0",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#388e3c",
    color: "#fff",
    cursor: "pointer",
    fontSize: "12px",
  },
  loadingText: {
    textAlign: "center",
    color: "#555",
  },
  errorText: {
    textAlign: "center",
    color: "#d32f2f",
  },
  noOrderText: {
    textAlign: "center",
    fontSize: "16px",
    color: "#d32f2f",
    marginTop: "20px",
    fontWeight: "bold",
  },
  popupOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  popupContent: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
    width: "400px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    overflowY: "auto",
  },
  popupTitle: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "10px",
    textAlign: "center",
  },
  popupTable: {
    width: "100%",
    borderCollapse: "collapse",
  },
  popupLabel: {
    fontWeight: "bold",
    color: "#333",
    padding: "8px",
    textAlign: "left",
    width: "130px",
    wordWrap: "break-word",
  },
  popupValue: {
    color: "#555",
    padding: "8px",
    wordWrap: "break-word",
    whiteSpace: "normal", // To allow the content to wrap when long
  },
  closeButton: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "15px 0", // Adjust padding to make it taller
    width: "100%", // Make the button span the full width of the popup
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
    fontSize: "16px",
    textAlign: "center", // Center the text
  },
};

export default FindOrderById;
