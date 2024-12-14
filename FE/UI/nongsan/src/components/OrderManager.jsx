import React, { useEffect, useState } from "react";
import OrderService from "../services/OrderService";
import Filters from "../components/Filters";

const OrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleDetails, setVisibleDetails] = useState({});
  const ordersPerPage = 5;
  const token = localStorage.getItem("token");
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    OrderService.getAllOrdersOfHousehold(token)
      .then((data) => {
        const sortedOrders = data.orders.sort(
          (a, b) => new Date(b.createDate) - new Date(a.createDate)
        );
        setOrders(sortedOrders);
        setFilteredOrders(sortedOrders);
        setTotalRevenue(data.totalRevenue);
        setError(null);
      })
      .catch((error) => {
        setError(
          error.response?.data || "Có lỗi xảy ra khi tải lịch sử đơn hàng."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = orders.filter((order) => {
      const isMatch =
        order.idOrderProduct.toString().includes(term) ||
        order.nameTraderOrder.toLowerCase().includes(term);

      const isProductMatch = order.orderItems.some((item) =>
        item.productName.toLowerCase().includes(term)
      );

      return isMatch || isProductMatch;
    });

    setFilteredOrders(filtered);
    setCurrentPage(1);
  };

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleFirstPage = () => {
    setCurrentPage(1);
  };

  const handleLastPage = () => {
    setCurrentPage(totalPages);
  };

  const toggleDetails = (idOrderProduct) => {
    setVisibleDetails((prevState) => ({
      ...prevState,
      [idOrderProduct]: !prevState[idOrderProduct],
    }));
  };

  if (loading) {
    return <p style={styles.loadingText}>Đang tải lịch sử đơn hàng...</p>;
  }

  if (error) {
    return <p style={styles.errorText}>{error}</p>;
  }

  const capitalizeWords = (str) => {
    if (!str) return "";
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <>
      <Filters />
      <div style={styles.container}>
        <h1 style={styles.title}>Lịch sử Đơn Hàng Hộ Gia Đình</h1>
        <div style={styles.revenueContainer}>
          <h2 style={styles.revenueText}>
            Tổng Doanh Thu: {totalRevenue.toLocaleString()} VNĐ
          </h2>
        </div>
        <div style={styles.searchContainer}>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Tìm kiếm theo ID, người bán, hoặc tên sản phẩm..."
            style={styles.searchInput}
          />
        </div>

        {filteredOrders.length === 0 ? (
          <p style={styles.noOrdersText}>Không có đơn hàng nào phù hợp.</p>
        ) : (
          <>
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
                {currentOrders.map((order) => (
                  <tr key={order.idOrderProduct} style={styles.tableRow}>
                    <td style={styles.tableCell}>{order.idOrderProduct}</td>
                    <td style={styles.tableCell}>{order.nameTraderOrder}</td>
                    <td style={styles.tableCell}>
                      {order.amountPaidOrderProduct.toLocaleString()} VNĐ
                    </td>
                    <td style={styles.tableCell}>
                      {order.adminCommissionOrderProduct.toLocaleString()} VNĐ
                    </td>
                    <td style={styles.tableCell}>{order.statusOrderProduct}</td>
                    <td style={styles.tableCell}>
                      {capitalizeWords(order.transferContentOrderProduct)}
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
                                {item.priceOrderProduct.toLocaleString()} VNĐ
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
            <div style={styles.pagination}>
              <button
                style={styles.paginationButton}
                onClick={handleFirstPage}
                disabled={currentPage === 1}
              >
                Tới Đầu Trang
              </button>
              <button
                style={styles.paginationButton}
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                Trước
              </button>
              <span style={styles.paginationInfo}>
                Trang {currentPage} / {totalPages}
              </span>
              <button
                style={styles.paginationButton}
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Tiếp
              </button>
              <button
                style={styles.paginationButton}
                onClick={handleLastPage}
                disabled={currentPage === totalPages}
              >
                Tới Cuối Trang
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

const styles = {
  container: {
    padding: "20px",
    maxWidth: "1200px",
    margin: "0 auto",
    fontFamily: "'Roboto', sans-serif",
    backgroundColor: "#f9fff4", // Màu nền nhạt
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  },
  title: {
    textAlign: "center",
    color: "#2e7d32", // Xanh lá cây đậm
    fontSize: "24px",
    marginBottom: "20px",
    fontWeight: "bold",
  },
  revenueContainer: {
    textAlign: "center",
    marginBottom: "20px",
  },
  revenueText: {
    fontSize: "20px",
    color: "#388e3c",
    fontWeight: "bold",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "#fff",
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  },
  tableHeader: {
    backgroundColor: "#388e3c", // Xanh lá đậm
    color: "#fff",
    padding: "10px",
    textAlign: "left",
    fontWeight: "bold",
  },
  tableRow: {
    borderBottom: "1px solid #ddd",
    transition: "background-color 0.3s ease",
  },
  tableRowHover: {
    backgroundColor: "#e8f5e9", // Xanh lá cây nhạt
  },
  tableCell: {
    padding: "10px",
    textAlign: "left",
    fontSize: "14px",
    color: "#333",
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
    color: "#d32f2f", // Đỏ nhấn mạnh lỗi
  },
  noOrdersText: {
    textAlign: "center",
    color: "#777",
  },
  scrollableList: {
    maxHeight: "150px", // Giới hạn chiều cao của danh sách
    overflowY: "auto", // Thêm thanh cuộn dọc
    padding: "10px", // Thêm khoảng cách trong danh sách
    border: "1px solid #ddd", // Viền nhẹ để phân biệt danh sách
    borderRadius: "5px",
    backgroundColor: "#f9fff4", // Nền nhạt phù hợp
  },
  pagination: {
    marginTop: "20px",
    textAlign: "center",
  },
  paginationButton: {
    padding: "10px 20px",
    margin: "0 10px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#388e3c",
    color: "#fff",
    cursor: "pointer",
    fontSize: "14px",
  },
  paginationButtonDisabled: {
    backgroundColor: "#ccc",
    cursor: "not-allowed",
  },
  paginationInfo: {
    fontSize: "16px",
    fontWeight: "bold",
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
  searchContainer: {
    marginBottom: "20px",
    textAlign: "center",
  },
  searchInput: {
    padding: "10px",
    width: "80%",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "16px",
  },
};

export default OrderManager;
