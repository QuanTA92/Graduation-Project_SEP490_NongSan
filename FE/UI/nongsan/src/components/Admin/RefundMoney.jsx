import React, { useEffect, useState } from "react";
import axios from "axios"; // Import Axios
import { toast, ToastContainer } from "react-toastify"; // Import react-toastify
import "react-toastify/dist/ReactToastify.css"; // Import styles for toast notifications

const RefundMoney = () => {
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

  // Fetch data on mount
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/orders/admin/get/withdrawalRequest", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const data = response.data;

        if (Array.isArray(data)) {
          const sortedOrders = data.sort(
            (a, b) => new Date(b.createDate) - new Date(a.createDate)
          );
          setOrders(sortedOrders);
          setFilteredOrders(sortedOrders);
          setError(null);
        } else {
          setError("Dữ liệu yêu cầu rút tiền không hợp lệ.");
        }
      })
      .catch((error) => {
        console.error("Lỗi khi tải dữ liệu:", error);
        setError("Có lỗi xảy ra khi tải yêu cầu rút tiền.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  const handleConfirmWithdrawal = (idOrderItem) => {
    const data = {
      idOrderItem: idOrderItem,
      withdrawalRequest: "Đã trả tiền đơn hàng", // Or any other status message you prefer
    };
  
    axios
      .put("http://localhost:8080/api/orders/admin/update/withdrawalRequest", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("Withdrawal request confirmed:", response.data);
        // Update the local orders state to reflect the change
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.idItemProduct === idOrderItem
              ? { ...order, withdrawalRequestProduct: "Đã trả tiền đơn hàng" }
              : order
          )
        );
        toast.success("Yêu cầu rút tiền đã được xác nhận.");
      })
      .catch((error) => {
        console.error("Error confirming withdrawal:", error);
        toast.error("Có lỗi khi xác nhận yêu cầu rút tiền.");
      });
  };

  
  // Search function
  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchTerm(searchTerm);
    const filtered = orders.filter(
      (order) =>
        order.idItemProduct.toString().includes(searchTerm) ||
        order.productName.toLowerCase().includes(searchTerm) ||
        order.nameHouseholdProduct.toLowerCase().includes(searchTerm)
    );
    setFilteredOrders(filtered);
  };

  // Open modal with detailed order info
  const openModal = (order) => {
    setCurrentOrderDetails(order);
    setShowModal(true);
  };

  // Close the modal
  const closeModal = () => {
    setShowModal(false);
    setCurrentOrderDetails(null);
  };

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  return (
    <>
      <div style={styles.container}>
        <h1 style={styles.title}>Danh Sách Yêu Cầu Rút Tiền</h1>

        <div style={styles.searchContainer}>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Tìm kiếm theo ID sản phẩm, tên sản phẩm hoặc tên hộ gia đình..."
            style={styles.searchInput}
          />
        </div>

        {filteredOrders.length === 0 ? (
          <p style={styles.noOrdersText}>Không có yêu cầu rút tiền nào phù hợp.</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>ID</th>
                <th style={styles.tableHeader}>Tên Sản Phẩm</th>
                <th style={styles.tableHeader}>Nhà Cung Cấp</th>
                <th style={styles.tableHeader}>Số Điện Thoại</th>
                <th style={styles.tableHeader}>Giá(VNĐ)</th>
                <th style={styles.tableHeader}>Yêu Cầu Rút Tiền</th>
                <th style={styles.tableHeader}>Chi Tiết</th>
                <th style={styles.tableHeader}>Xác nhận rút tiền</th>

              </tr>
            </thead>
            <tbody>
              {currentOrders.map((order) => (
                <tr key={order.idItemProduct} style={styles.tableRow}>
                  <td style={styles.tableCell}>{order.idItemProduct}</td>
                  <td style={styles.tableCell}>{order.productName}</td>
                  <td style={styles.tableCell}>{order.nameHouseholdProduct}</td>
                  <td style={styles.tableCell}>{order.phoneNumberHouseholdProduct}</td>
                  <td style={styles.tableCell}>
                    {order.priceOrderProduct.toLocaleString()}đ
                  </td>
                  <td style={styles.tableCell}>{order.withdrawalRequestProduct}</td>
                  <td style={styles.tableCell}>
                    <button
                      style={styles.toggleButton}
                      onClick={() => openModal(order)}
                    >
                      👁️ Xem Chi Tiết
                    </button>
                  </td>
                  <td style={styles.tableCell}> {/* New column for confirm button */}
        {order.withdrawalRequestProduct !== "Đã trả tiền đơn hàng" && (
          <button
            style={styles.toggleButton}
            onClick={() => handleConfirmWithdrawal(order.idItemProduct)}
          >
            Xác Nhận Rút Tiền
          </button>
        )}
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
              <h2 style={styles.modalTitle}>Chi Tiết Yêu Cầu Rút Tiền</h2>
              <ul style={styles.itemList}>
                <li style={styles.itemDetail}>
                  <div style={styles.itemDetailRow}>
                    <span style={styles.itemLabel}>Tên Sản Phẩm:</span>
                    <span style={styles.itemValue}>{currentOrderDetails.productName}</span>
                  </div>
                  <div style={styles.itemDetailRow}>
                    <span style={styles.itemLabel}>Nhà Cung Cấp:</span>
                    <span style={styles.itemValue}>{currentOrderDetails.nameHouseholdProduct}</span>
                  </div>
                  <div style={styles.itemDetailRow}>
                    <span style={styles.itemLabel}>Số Điện Thoại:</span>
                    <span style={styles.itemValue}>{currentOrderDetails.phoneNumberHouseholdProduct}</span>
                  </div>
                  <div style={styles.itemDetailRow}>
                    <span style={styles.itemLabel}>Địa Chỉ:</span>
                    <span style={styles.itemValue}>
                      {currentOrderDetails.specificAddressProduct}, {currentOrderDetails.wardProduct}, {currentOrderDetails.districtProduct}, {currentOrderDetails.cityProduct}
                    </span>
                  </div>
                  <div style={styles.itemDetailRow}>
                    <span style={styles.itemLabel}>Yêu Cầu Rút Tiền:</span>
                    <span style={styles.itemValue}>{currentOrderDetails.withdrawalRequestProduct}</span>
                  </div>
                </li>
              </ul>
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
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    maxWidth: "800px",
    width: "80%",
    animation: "slideUp 0.3s", // Animation for sliding up effect
  },
  modalTitle: {
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "24px",
    color: "#388e3c",
  },
  itemList: {
    listStyleType: "none",
    padding: 0,
  },
  itemDetail: {
    marginBottom: "20px",
    borderBottom: "1px solid #ddd",
    paddingBottom: "10px",
  },
  itemDetailRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "5px 0",
  },
  itemLabel: {
    fontWeight: "bold",
    color: "#388e3c",
  },
  itemValue: {
    fontSize: "16px",
    color: "#555",
  },
  closeButton: {
    display: "block",
    width: "100%",
    padding: "10px",
    backgroundColor: "#388e3c",
    color: "#fff",
    fontSize: "16px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default RefundMoney;
