import React, { useEffect, useState } from "react";
import OrderService from "../services/OrderService";
import Filters from "../components/Filters";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OrderTrader = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [updatedOrders, setUpdatedOrders] = useState([]);
  const ordersPerPage = 5;
  const token = localStorage.getItem("token");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Confirmation modal state
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [orderToUpdate, setOrderToUpdate] = useState(null);

  useEffect(() => {
    OrderService.getAllOrdersOfTrader(token)
      .then((data) => {
        const sortedOrders = data.sort(
          (a, b) => new Date(b.createDate) - new Date(a.createDate)
        );
        setOrders(sortedOrders);
        setFilteredOrders(sortedOrders);
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

      const isHouseholdMatch = order.orderItems.some((item) =>
        item.productName?.toLowerCase().includes(term)
      );

      return isMatch || isHouseholdMatch;
    });

    setFilteredOrders(filtered);
    setCurrentPage(1);
  };

  const updateOrderStatus = (orderId) => {
    setOrderToUpdate(orderId); // Set the order to be updated
    setShowConfirmationModal(true); // Show confirmation modal
  };

  const confirmUpdateStatus = () => {
    if (orderToUpdate) {
      OrderService.updateOrderStatus(orderToUpdate, "Đã nhận hàng", token)
        .then((updatedOrder) => {
          setUpdatedOrders((prevState) => [
            ...prevState,
            updatedOrder.idOrderProduct,
          ]);

          OrderService.getAllOrdersOfTrader(token)
            .then((data) => {
              const sortedOrders = data.sort(
                (a, b) => new Date(b.createDate) - new Date(a.createDate)
              );
              setOrders(sortedOrders);
              setFilteredOrders(sortedOrders);
              toast.success("Trạng thái đơn hàng đã được cập nhật.");
            })
            .catch((error) => {
              setError(
                error.response?.data || "Có lỗi xảy ra khi tải lại đơn hàng."
              );
            });
        })
        .catch((error) => {
          toast.error("Có lỗi xảy ra khi cập nhật trạng thái.");
        });
    }
    setShowConfirmationModal(false); // Close modal after confirmation
  };

  const cancelUpdateStatus = () => {
    setShowConfirmationModal(false); // Close modal if canceled
  };

  // Handle showing details of order
  const handleShowDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailsModal(false);
    setSelectedOrder(null);
  };

  // Pagination
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

  const capitalizeWords = (str) => {
    if (!str) return "";
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  if (loading) {
    return <p style={styles.loadingText}>Đang tải lịch sử đơn hàng...</p>;
  }

  if (error) {
    return <p style={styles.errorText}>{error}</p>;
  }

  return (
    <>
      <Filters />
      <div style={styles.container}>
        <ToastContainer
          position="bottom-left"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
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
          <>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.tableHeader}>ID</th>
                  <th style={styles.tableHeader}>Người mua</th>
                  <th style={styles.tableHeader}>Tổng thanh toán</th>
                  <th style={styles.tableHeader}>Phí quản lí hệ thống</th>
                  <th style={styles.tableHeader}>Trạng thái</th>
                  <th style={styles.tableHeader}>Nội dung thanh toán</th>
                  <th style={styles.tableHeader}>Ngày tạo</th>
                  <th style={styles.tableHeader}>Chi tiết sản phẩm</th>
                  <th style={styles.tableHeader}>Cập nhật trạng thái</th>
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
                        onClick={() => handleShowDetails(order)}
                      >
                        👁️ Chi tiết
                      </button>

                      {showDetailsModal && selectedOrder && (
                        <div style={styles.modalOverlay}>
                          <div style={styles.modalContent}>
                            <h2 style={{ textAlign: "center", color: "#388e3c" }}>
                              Chi tiết đơn hàng
                            </h2>
                            <ul style={styles.itemList}>
                              {selectedOrder.orderItems.map((item) => (
                                <li key={item.idItemProduct} style={styles.itemDetail}>
                                  <p style={styles.itemDetailHeading}>Tên sản phẩm:</p>
                                  <p style={styles.itemDetailText}>
                                    {item.productName}
                                  </p>

                                  <p style={styles.itemDetailHeading}>Hộ gia đình:</p>
                                  <p style={styles.itemDetailText}>
                                    {item.nameHouseholdProduct}
                                  </p>

                                  <p style={styles.itemDetailHeading}>Địa chỉ:</p>
                                  <p style={styles.itemDetailText}>
                                    {item.specificAddressProduct}, {item.wardProduct},{" "}
                                    {item.districtProduct}, {item.cityProduct}
                                  </p>

                                  <p style={styles.itemDetailHeading}>Giá:</p>
                                  <p style={styles.itemDetailText}>
                                    {item.priceOrderProduct.toLocaleString()} VNĐ
                                  </p>

                                  <p style={styles.itemDetailHeading}>Số lượng:</p>
                                  <p style={styles.itemDetailText}>
                                    {item.quantityOrderProduct}
                                  </p>

                                  <p style={styles.itemDetailHeading}>Số điện thoại:</p>
                                  <p style={styles.itemDetailText}>
                                    {item.phoneNumberHouseholdProduct}
                                  </p>
                                </li>
                              ))}
                            </ul>
                            <button
                              onClick={handleCloseModal}
                              style={styles.closeButton}
                            >
                              Đóng
                            </button>
                          </div>
                        </div>
                      )}
                    </td>
                    <td style={styles.tableCell}>
                      {updatedOrders.includes(order.idOrderProduct) ? (
                        <span>Đã cập nhật</span>
                      ) : (
                        order.statusOrderProduct !== "Đã nhận hàng" && (
                          <button
                            style={styles.updateButton}
                            onClick={() => updateOrderStatus(order.idOrderProduct)}
                          >
                            Đã nhận hàng
                          </button>
                        )
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

      {/* Confirmation Modal */}
      {showConfirmationModal && (
  <div style={styles.modalOverlay}>
    <div style={styles.modalContent}>
      <h2 style={styles.modalHeader}>Xác nhận cập nhật trạng thái</h2>
      <p style={styles.modalBody}>
        Bạn có chắc chắn muốn cập nhật trạng thái đơn hàng này?
      </p>
      <div style={styles.modalActions}>
        <button
          style={styles.confirmButton}
          onClick={confirmUpdateStatus}
        >
          Xác nhận
        </button>
        <button
          style={styles.cancelButton}
          onClick={cancelUpdateStatus}
        >
          Hủy
        </button>
      </div>
    </div>
  </div>
)}
    </>
  );
};

const styles = {
  container: {
    padding: "20px",
    maxWidth: "1200px",
    margin: "0 auto",
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
  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "#fff",
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  },
  tableHeader: {
    backgroundColor: "#388e3c",
    color: "#fff",
    padding: "10px",
    textAlign: "left",
    fontWeight: "bold",
  },
  tableCell: {
    padding: "10px",
    textAlign: "left",
    fontSize: "14px",
    color: "#333",
  },
  loadingText: {
    textAlign: "center",
    color: "#555",
  },
  errorText: {
    textAlign: "center",
    color: "#d32f2f",
  },
  updateButton: {
    padding: "5px 10px",
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
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    transition: "opacity 0.3s ease-in-out",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
    width: "80%",
    maxWidth: "600px",
    maxHeight: "80%",
    overflowY: "auto",
    animation: "fadeIn 0.5s ease-out",
  },
  closeButton: {
    padding: "15px 0", // Adjust padding to make it taller
    width: "100%", // Make the button span the full width of the modal
    backgroundColor: "#d32f2f",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    textTransform: "uppercase",
    textAlign: "center", // Center the text
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
    transition: "background-color 0.3s",
  },

  closeButtonHover: {
    backgroundColor: "#b71c1c",
  },
  itemDetail: {
    marginBottom: "20px",
    padding: "15px",
    borderBottom: "2px solid #e0e0e0",
    fontSize: "16px",
    color: "#555",
    lineHeight: "1.5",
    // display: "flex", // Make the container flex to align items horizontally
    justifyContent: "space-between", // Space between heading and text
  },
  itemDetailHeading: {
    fontWeight: "bold",
    color: "#388e3c",
    fontSize: "18px",
    flex: "1", // Allow the heading to take up available space
  },
  itemDetailText: {
    marginTop: "5px",
    flex: "2", // Allow the text to take more space if needed
    wordBreak: "break-word", // To allow text to wrap within the available space
  },

  itemList: {
    listStyleType: "none",
    padding: "0",
    margin: "0",
  },
  modalHeader: {
    textAlign: "center",
    color: "#388e3c",
    fontSize: "22px",
    marginBottom: "15px",
    fontWeight: "600",
  },

  modalBody: {
    textAlign: "center",
    fontSize: "16px",
    color: "#333",
    marginBottom: "20px",
    lineHeight: "1.5",
  },

  modalActions: {
    display: "flex",
    justifyContent: "space-around",
  },

  confirmButton: {
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#388e3c",
    color: "#fff",
    cursor: "pointer",
    fontSize: "16px",
    transition: "background-color 0.3s ease",
  },

  cancelButton: {
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#d32f2f",
    color: "#fff",
    cursor: "pointer",
    fontSize: "16px",
    transition: "background-color 0.3s ease",
  },

  confirmButtonHover: {
    backgroundColor: "#2c6a2f",
  },

  cancelButtonHover: {
    backgroundColor: "#b71c1c",
  },

  closeButton: {
    padding: "10px 20px",
    width: "100%",
    backgroundColor: "#d32f2f",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    textAlign: "center",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
    transition: "background-color 0.3s",
  },

  closeButtonHover: {
    backgroundColor: "#b71c1c",
  },
};

export default OrderTrader;
