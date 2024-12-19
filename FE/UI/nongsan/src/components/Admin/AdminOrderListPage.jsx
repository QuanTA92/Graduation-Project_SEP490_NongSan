import React, { useEffect, useState } from "react";
import AdminService from "../../services/AdminService"; // Import AdminService

const AdminOrderListPage = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleDetails, setVisibleDetails] = useState({});

  const [showModal, setShowModal] = useState(false);
  const [currentOrderDetails, setCurrentOrderDetails] = useState(null);

  const ordersPerPage = 5;
  const token = localStorage.getItem("token");

  useEffect(() => {
    AdminService.listAllOrders(token)
      .then((response) => {
        const data = response.data; // Lấy dữ liệu trả về từ API

        if (Array.isArray(data.orders)) {
          const sortedOrders = data.orders.sort(
            (a, b) => new Date(b.createDate) - new Date(a.createDate)
          );
          setOrders(sortedOrders);
          setFilteredOrders(sortedOrders);
          setError(null); // Xóa lỗi nếu có
        } else {
          setError("Dữ liệu đơn hàng không hợp lệ.");
        }
      })
      .catch((error) => {
        console.error("Lỗi khi tải dữ liệu:", error);
        setError("Có lỗi xảy ra khi tải lịch sử đơn hàng.");
      })
      .finally(() => {
        setLoading(false); // Đảm bảo cập nhật trạng thái loading sau khi xong
      });
  }, [token]);

  const toggleDetails = (orderId) => {
    setVisibleDetails((prevState) => ({
      ...prevState,
      [orderId]: !prevState[orderId],
    }));
  };

  const openModal = (order) => {
    setCurrentOrderDetails(order);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentOrderDetails(null);
  };

  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchTerm(searchTerm);
    const filtered = orders.filter(
      (order) =>
        order.idOrderProduct.toString().includes(searchTerm) ||
        order.nameTraderOrder.toLowerCase().includes(searchTerm) ||
        order.orderItems.some((item) =>
          item.productName.toLowerCase().includes(searchTerm)
        )
    );
    setFilteredOrders(filtered);
  };

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  return (
    <>
      <div style={styles.container}>
        <h1 style={styles.title}>Lịch sử Đơn Hàng</h1>

        <div style={styles.searchContainer}>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Tìm kiếm theo ID, người mua, hoặc tên sản phẩm..."
            style={styles.searchInput}
          />
        </div>

        {filteredOrders.length === 0 ? (
          <p style={styles.noOrdersText}>Không có đơn hàng nào phù hợp.</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>ID</th>
                <th style={styles.tableHeader}>Người mua</th>
                <th style={styles.tableHeader}>Tổng thanh toán</th>
                <th style={styles.tableHeader}>Phí quản lí hệ thống</th>
                <th style={styles.tableHeader}>Trạng thái</th>
                <th style={styles.tableHeader}>Nội dung thanh toán</th>
                <th style={styles.tableHeader}>Ngày mua</th>
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
                    {order.transferContentOrderProduct}
                  </td>
                  <td style={styles.tableCell}>{order.createDate}</td>
                  <td style={styles.tableCell}>
                    <button
                      style={styles.toggleButton}
                      onClick={() => openModal(order)}
                    >
                      👁️Xem chi tiết
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Modal */}
        {showModal && currentOrderDetails && (
          <div style={styles.modalOverlay}>
            <div style={styles.modal}>
              <h2 style={styles.modalTitle}>Chi tiết đơn hàng</h2>

              {/* List of items in the order */}
              <ul style={styles.itemList}>
                {currentOrderDetails.orderItems.map((item) => (
                  <li key={item.idItemProduct} style={styles.itemDetail}>
                    <div style={styles.itemDetailRow}>
                      <span style={styles.itemLabel}>Tên sản phẩm:</span>
                      <span style={styles.itemValue}>{item.productName}</span>
                    </div>
                    <div style={styles.itemDetailRow}>
                      <span style={styles.itemLabel}>Hộ gia đình:</span>
                      <span style={styles.itemValue}>
                        {item.nameHouseholdProduct}
                      </span>
                    </div>
                    <div style={styles.itemDetailRow}>
                      <span style={styles.itemLabel}>Giá:</span>
                      <span style={styles.itemValue}>
                        {item.priceOrderProduct.toLocaleString()} VNĐ
                      </span>
                    </div>
                    <div style={styles.itemDetailRow}>
                      <span style={styles.itemLabel}>Số lượng:</span>
                      <span style={styles.itemValue}>
                        {item.quantityOrderProduct}
                      </span>
                    </div>
                    <div style={styles.itemDetailRow}>
                      <span style={styles.itemLabel}>Địa chỉ:</span>
                      <span style={styles.itemValue}>
                        {item.specificAddressProduct}, {item.wardProduct},{" "}
                        {item.districtProduct}, {item.cityProduct}
                      </span>
                    </div>
                    <div style={styles.itemDetailRow}>
                      <span style={styles.itemLabel}>SĐT:</span>
                      <span style={styles.itemValue}>
                        {item.phoneNumberHouseholdProduct}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Close button */}
              <button style={styles.closeButton} onClick={closeModal}>
                Đóng
              </button>
            </div>
          </div>
        )}

        {/* Pagination */}
        <div style={styles.pagination}>
          <button
            style={styles.paginationButton}
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
            Tới Đầu Trang
          </button>
          <button
            style={styles.paginationButton}
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Trước
          </button>
          <span style={styles.paginationInfo}>
            Trang {currentPage} / {totalPages}
          </span>
          <button
            style={styles.paginationButton}
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Tiếp
          </button>
          <button
            style={styles.paginationButton}
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          >
            Tới Cuối Trang
          </button>
        </div>
      </div>
    </>
  );
};

const styles = {
  container: {
    padding: "20px",
    maxWidth: "1200px",
    margin: "40px auto",
    fontFamily: "'Roboto', sans-serif",
    backgroundColor: "#f9fff4", // Màu nền nhạt
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    marginTop: "70px",
  },
  title: {
    textAlign: "center",
    color: "#2e7d32", // Xanh lá cây đậm
    fontSize: "24px",
    marginBottom: "20px",
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
  noOrdersText: {
    textAlign: "center",
    color: "#777",
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
  paginationInfo: {
    fontSize: "16px",
    fontWeight: "bold",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Darker overlay
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    animation: "fadeIn 0.3s", // Smooth opening animation
  },
  modal: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "10px",
    width: "60%",
    maxHeight: "80%",
    overflowY: "auto",
    transition: "transform 0.3s ease-in-out",
    position: "relative", // For absolute positioning of close button
  },
  modalTitle: {
    fontSize: "24px",
    color: "#388e3c",
    textAlign: "center",
    marginBottom: "20px",
    fontWeight: "bold",
  },
  itemList: {
    listStyle: "none",
    paddingLeft: 0,
    marginTop: "20px",
  },
  itemDetail: {
    marginBottom: "15px", // Add space between each item
    padding: "15px",
    borderRadius: "8px", // Rounded corners for each item
  },
  itemDetailRow: {
    marginBottom: "10px", // Space between rows
    display: "flex",
    // justifyContent: "space", // Align label and value at opposite ends
  },
  itemLabel: {
    fontWeight: "bold",
    color: "#388e3c", // Green color for labels
    fontSize: "16px",
  },
  itemValue: {
    color: "#333",
    fontSize: "16px",
    wordBreak: "break-word", // Prevent long words from overflowing
    paddingLeft: "20px",
  },
  closeButton: {
    padding: "12px 25px",
    backgroundColor: "#388e3c",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    marginTop: "20px", // Adds some space between the list and the button
    display: "block",
    marginLeft: "auto",
    marginRight: "auto", // Center the close button
  },
};

export default AdminOrderListPage;
