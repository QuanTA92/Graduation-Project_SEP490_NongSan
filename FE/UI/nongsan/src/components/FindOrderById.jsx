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

  const axiosInstance = axios.create({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const apiBase = "http://localhost:8080/api/product/household/get";
  const orderApiBase =
    "http://localhost:8080/api/orders/household/get/product/";

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
    setOrderData(null); // Đặt lại dữ liệu trước khi gọi API
    try {
      const response = await axiosInstance.get(`${orderApiBase}${productId}`);
      if (response.data.orders && response.data.orders.length > 0) {
        setOrderData(response.data);
        setTotalRevenue(response.data.totalRevenueProduct);
      } else {
        setOrderData({ orders: [] }); // Trả về cấu trúc rỗng nếu không có đơn đặt hàng
        setTotalRevenue(0); // Đặt doanh thu về 0
      }
    } catch (error) {
      setError("Không có đơn đặt hàng nào cho sản phẩm này."); // Thay đổi thông báo lỗi
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

  const toggleDetails = (idOrderProduct) => {
    setVisibleDetails((prevState) => ({
      ...prevState,
      [idOrderProduct]: !prevState[idOrderProduct],
    }));
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
            <th style={styles.tableHeader}>Người bán</th>
            <th style={styles.tableHeader}>Tổng thanh toán</th>
            <th style={styles.tableHeader}>Phí quản lí hệ thống</th>
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
                {order.amountPaidOrderProduct.toLocaleString()} VND
              </td>
              <td style={styles.tableCell}>
                {order.adminCommissionOrderProduct.toLocaleString()} VND
              </td>
              <td style={styles.tableCell}>{order.statusOrderProduct}</td>
              <td style={styles.tableCell}>
                {order.transferContentOrderProduct}
              </td>
              <td style={styles.tableCell}>{order.createDate}</td>
              <td style={styles.tableCell}>
                <button
                  style={styles.toggleButton}
                  onClick={() => toggleDetails(order.idOrderProduct)}
                >
                  {visibleDetails[order.idOrderProduct]
                    ? "👁️ Ẩn"
                    : "👁️ Hiện"}
                </button>
                {visibleDetails[order.idOrderProduct] && (
                  <ul style={styles.scrollableList}>
                    {order.orderItems.map((item) => (
                      <li
                        key={item.idItemProduct}
                        style={styles.itemDetail}
                      >
                        <p>
                          <strong>Tên:</strong> {item.productName}
                        </p>
                        <p>
                          <strong>Giá:</strong>{" "}
                          {item.priceOrderProduct.toLocaleString()} VND
                        </p>
                        <p>
                          <strong>Số lượng:</strong>{" "}
                          {item.quantityOrderProduct}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
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
  scrollableList: {
    maxHeight: "150px",
    overflowY: "auto",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    backgroundColor: "#f9fff4",
  },
  itemDetail: {
    borderBottom: "1px solid #ddd",
    marginBottom: "10px",
    paddingBottom: "10px",
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
  
};

export default FindOrderById;
