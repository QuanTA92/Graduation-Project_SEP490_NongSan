import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const PaymentResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const paymentStatus = params.get("vnp_TransactionStatus");
    const orderId = params.get("orderId"); // Lấy orderId từ URL

    if (paymentStatus === "00" && orderId) {
      // Thanh toán thành công, gọi API để lấy thông tin đơn hàng
      axios
        .get(`http://localhost:8080/api/orders/trader/get/${orderId}`)
        .then((response) => {
          setOrderDetails(response.data); // Lưu thông tin đơn hàng
          setLoading(false);
        })
        .catch((error) => {
          setError("Không thể lấy thông tin đơn hàng.");
          setLoading(false);
        });
    } else {
      // Thanh toán thất bại
      setError("Thanh toán không thành công.");
      setLoading(false);
    }
  }, [location]);

  // Chuyển hướng đến trang lịch sử đơn hàng
  const handleGoToOrderHistory = () => {
    navigate("/orderhistory");
  };

  if (loading) {
    return <div>Đang xử lý kết quả thanh toán...</div>;
  }

  return (
    <div>
      {error && <div style={{ color: "red", fontWeight: "bold" }}>{error}</div>}

      {orderDetails && !error && (
        <div>
          <h2>Thông tin đơn hàng</h2>
          <p><strong>Mã đơn hàng:</strong> {orderDetails.id}</p>
          <p><strong>Tổng tiền:</strong> {orderDetails.totalAmount} đ</p>
          <p><strong>Trạng thái thanh toán:</strong> {orderDetails.paymentStatus}</p>
          <p><strong>Sản phẩm:</strong></p>
          <ul>
            {orderDetails.items.map((item) => (
              <li key={item.id}>
                {item.name} - {item.quantity} x {item.price} đ
              </li>
            ))}
          </ul>
          
          <button onClick={handleGoToOrderHistory} style={styles.button}>
            Xem Lịch sử Đơn hàng
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  button: {
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    padding: "0.75rem 1.5rem",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "1rem",
    marginTop: "1rem",
    transition: "background-color 0.3s",
  },
};

export default PaymentResult;
