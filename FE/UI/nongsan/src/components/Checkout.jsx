import React, { useState } from "react";

const Checkout = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    // address: "",
    phone: "",
    email: "",
    orderNote: "",
    paymentMethod: "bankTransfer",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Order data:", formData);
  };

  const styles = {
    container: {
      maxWidth: "1000%",
      margin: "0 auto",
      display: "flex",
      gap: "2rem",
    },
    section: {
      flex: "1",
      padding: "1.5rem",
      borderRadius: "8px",
      
    },
    header: {
      color: "#4CAF50", // màu xanh nông sản
      fontSize: "1.5rem",
      fontWeight: "bold",
      marginBottom: "1rem",
    },
    formGroup: {
      marginBottom: "1rem",
    },
    label: {
      display: "block",
      fontWeight: "bold",
      marginBottom: "0.5rem",
      color: "#333",
    },
    input: {
      width: "100%",
      padding: "0.75rem",
      border: "1px solid #ddd",
      borderRadius: "6px",
      marginBottom: "1rem",
      fontSize: "1rem",
    },
    textarea: {
      width: "100%",
      padding: "0.75rem",
      border: "1px solid #ddd",
      borderRadius: "6px",
      marginBottom: "1rem",
      fontSize: "1rem",
    },
    orderSummary: {
      paddingBottom: "0.5rem",
      marginBottom: "1rem",
      borderBottom: "1px solid #e0e0e0",
      fontWeight: "bold",
      display: "flex",
      justifyContent: "space-between",
      color: "#4CAF50",
    },
    orderItem: {
      padding: "0.5rem 0",
      borderBottom: "1px solid #e0e0e0",
      display: "flex",
      justifyContent: "space-between",
    },
    orderTotal: {
      padding: "0.5rem 0",
      fontWeight: "bold",
      display: "flex",
      justifyContent: "space-between",
      color: "#d35400",
    },
    paymentMethod: {
      marginTop: "1rem",
      fontWeight: "bold",
      color: "#333",
    },
    button: {
      backgroundColor: "#d35400",
      color: "#fff",
      border: "none",
      padding: "0.75rem 1.5rem",
      borderRadius: "4px",
      cursor: "pointer",
      marginTop: "1rem",
      fontSize: "1rem",
    },
  };

  return (
    <div style={styles.container}>
      {/* Chi Tiết Thanh Toán */}
      <div style={styles.section}>
        <h2 style={styles.header}>Chi Tiết Thanh Toán</h2>
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Tên *</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Họ *</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          {/* <div style={styles.formGroup}>
            <label style={styles.label}>Địa chỉ *</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Số nhà và tên đường"
              required
              style={styles.input}
            />
          </div> */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Số điện thoại *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Địa chỉ email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Thông tin bổ sung</label>
            <textarea
              name="orderNote"
              value={formData.orderNote}
              onChange={handleChange}
              placeholder="Ghi chú về đơn đặt hàng của bạn"
              style={styles.textarea}
            ></textarea>
          </div>
        </form>
      </div>

      {/* Thông Tin Đơn Hàng */}
      <div style={styles.section}>
        <h2 style={styles.header}>Thông Tin Đơn Hàng</h2>
        <div style={styles.orderSummary}>
          <span>SẢN PHẨM</span>
          <span>TẠM TÍNH</span>
        </div>
        <div style={styles.orderItem}>
          <span>Bơ hữu cơ × 1</span>
          <span>95.000 đ</span>
        </div>
        <div style={styles.orderItem}>
          <span>TẠM TÍNH</span>
          <span>95.000 đ</span>
        </div>
        <div style={styles.orderTotal}>
          <span>TỔNG</span>
          <span>95.000 đ</span>
        </div>
        <div style={styles.paymentMethod}>
          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="bankTransfer"
              checked={formData.paymentMethod === "bankTransfer"}
              onChange={handleChange}
            />
            Chuyển khoản ngân hàng
          </label>
          <p>
            Thực hiện thanh toán vào tài khoản ngân hàng của chúng tôi. Vui lòng
            sử dụng Mã đơn hàng trong phần Nội dung thanh toán. 
          </p>
          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="cashOnDelivery"
              checked={formData.paymentMethod === "cashOnDelivery"}
              onChange={handleChange}
            />
            Trả tiền mặt khi nhận hàng
          </label>
        </div>
        <button type="submit" style={styles.button} onClick={handleSubmit}>
          ĐẶT HÀNG
        </button>
      </div>
    </div>
  );
};

export default Checkout;
