import React, { useState } from "react";

const FarmerProductForm = ({ initialData = {}, onSave }) => {
  const [formData, setFormData] = useState({
    productName: initialData?.productName || "",
    price: initialData?.price || "",
    quantity: initialData?.quantity || "",
    status: initialData?.status || "Còn hàng",
    productImage: initialData?.productImage || null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, productImage: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (typeof onSave === "function") {
      onSave(formData);
      console.log("Dữ liệu sản phẩm:", formData);
    } else {
      console.warn("Lỗi: onSave không được cung cấp.");
    }
  };

  const styles = {
    formContainer: {
      maxWidth: "600px",
      margin: "0 auto",
      padding: "20px",
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "20px",
      backgroundColor: "#F5F8F2",
      borderRadius: "8px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    },
    title: {
      textAlign: "center",
      marginBottom: "20px",
      color: "#333",
      gridColumn: "span 2",
    },
    formGroup: {
      marginBottom: "15px",
    },
    label: {
      display: "block",
      fontWeight: "bold",
      marginBottom: "5px",
      color: "#4B752A",
    },
    input: {
      width: "100%",
      padding: "10px",
      border: "1px solid #ddd",
      borderRadius: "4px",
      fontSize: "16px",
    },
    uploadContainer: {
      padding: "10px",
      border: "1px dashed #ddd",
      borderRadius: "8px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "200px",
      textAlign: "center",
      fontSize: "14px",
      color: "#666",
      flexDirection: "column",
      gridColumn: "span 2",
    },
    submitButton: {
      padding: "10px",
      backgroundColor: "#4CAF50",
      color: "white",
      fontSize: "16px",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      gridColumn: "span 2",
    },
  };

  return (
    <div style={styles.formContainer}>
      <h2 style={styles.title}>Thêm Sản Phẩm</h2>

      {/* Upload Image Container */}
      <div style={styles.uploadContainer}>
        <input
          type="file"
          name="productImage"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: "none" }}
          id="fileUpload"
        />
        <label htmlFor="fileUpload" style={{ cursor: "pointer", color: "#4CAF50" }}>
          Tải lên ảnh sản phẩm (PNG, JPG, GIF lên đến 10MB)
        </label>
      </div>

      {/* Tên Sản Phẩm */}
      <div style={styles.formGroup}>
        <label style={styles.label}>Tên Sản Phẩm *</label>
        <input
          type="text"
          name="productName"
          value={formData.productName}
          onChange={handleChange}
          style={styles.input}
          required
        />
      </div>

      {/* Giá */}
      <div style={styles.formGroup}>
        <label style={styles.label}>Giá (VND) *</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          style={styles.input}
          required
        />
      </div>

      {/* Số Lượng */}
      <div style={styles.formGroup}>
        <label style={styles.label}>Số Lượng *</label>
        <input
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          style={styles.input}
          required
        />
      </div>

      {/* Trạng Thái */}
      <div style={styles.formGroup}>
        <label style={styles.label}>Trạng Thái *</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          style={styles.input}
        >
          <option value="Còn hàng">Còn hàng</option>
          <option value="Hết hàng">Hết hàng</option>
        </select>
      </div>

      <button type="submit" style={styles.submitButton} onClick={handleSubmit}>
        Thêm Sản Phẩm
      </button>
    </div>
  );
};

export default FarmerProductForm;
