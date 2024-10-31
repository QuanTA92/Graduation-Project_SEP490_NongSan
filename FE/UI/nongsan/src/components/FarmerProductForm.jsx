import React, { useState } from "react";

const FarmerProductForm = () => {
  const [formData, setFormData] = useState({
    productName: "",
    productDescription: "",
    expirationDate: "",
    status: "",
    qualityCheck: "",
    quantity: "",
    idSubcategory: "",
    productImage: null,
    price: "",
    specificAddress: "",
    ward: "",
    district: "",
    city: "",
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
    console.log("Dữ liệu sản phẩm:", formData);
  };

  const styles = {
    formContainer: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "20px",
      // backgroundColor: "#F5F8F2",
      // borderRadius: "8px",
      // boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "20px",
    },
    title: {
      textAlign: "center",
      marginBottom: "20px",
      color: "#333",
      gridColumn: "span 3",
    },
    formGroup: {
      marginBottom: "15px",
      padding: "15px",
      border: "1px solid #ddd",
      borderRadius: "4px",
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
    textarea: {
      width: "100%",
      padding: "10px",
      border: "1px solid #ddd",
      borderRadius: "4px",
      fontSize: "16px",
      minHeight: "80px",
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
      gridColumn: "span 3", // Đặt upload container ở trên
    },
    submitButton: {
      padding: "8px 16px",
      backgroundColor: "#4CAF50",
      color: "white",
      fontSize: "16px",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      marginTop: "20px",
      gridColumn: "3", // Đặt nút submit ở cột bên phải
      justifySelf: "end", // Đưa nút về bên phải
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
          Tải lên tệp hoặc kéo và thả PNG, JPG, GIF lên đến 10MB
        </label>
      </div>

      {/* Column 1 */}
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

      <div style={styles.formGroup}>
        <label style={styles.label}>Mô Tả Sản Phẩm *</label>
        <textarea
          name="productDescription"
          value={formData.productDescription}
          onChange={handleChange}
          style={styles.textarea}
          required
        ></textarea>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Ngày Hết Hạn *</label>
        <input
          type="date"
          name="expirationDate"
          value={formData.expirationDate}
          onChange={handleChange}
          style={styles.input}
          required
        />
      </div>

      {/* Column 2 */}
      <div style={styles.formGroup}>
        <label style={styles.label}>Trạng Thái *</label>
        <input
          type="text"
          name="status"
          value={formData.status}
          onChange={handleChange}
          style={styles.input}
          required
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Kiểm Tra Chất Lượng *</label>
        <input
          type="text"
          name="qualityCheck"
          value={formData.qualityCheck}
          onChange={handleChange}
          style={styles.input}
          required
        />
      </div>

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

      {/* Column 3 */}
      <div style={styles.formGroup}>
        <label style={styles.label}>ID Danh Mục Con *</label>
        <input
          type="text"
          name="idSubcategory"
          value={formData.idSubcategory}
          onChange={handleChange}
          style={styles.input}
          required
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Địa Chỉ Cụ Thể *</label>
        <input
          type="text"
          name="specificAddress"
          value={formData.specificAddress}
          onChange={handleChange}
          style={styles.input}
          required
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Phường *</label>
        <input
          type="text"
          name="ward"
          value={formData.ward}
          onChange={handleChange}
          style={styles.input}
          required
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Quận *</label>
        <input
          type="text"
          name="district"
          value={formData.district}
          onChange={handleChange}
          style={styles.input}
          required
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Thành Phố *</label>
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
          style={styles.input}
          required
        />
      </div>

      <button type="submit" style={styles.submitButton} onClick={handleSubmit}>
        Thêm Sản Phẩm
      </button>
    </div>
  );
};

export default FarmerProductForm;
