import React, { useState } from "react";


const Admin = () => {
  const [admins, setAdmins] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    username: "",
    email: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  // Xử lý thay đổi dữ liệu trong form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Thêm admin
  const handleAddAdmin = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.username || !formData.email) return;
    setAdmins([...admins, { ...formData, id: Date.now() }]);
    setFormData({ id: null, name: "", username: "", email: "" });
  };

  // Sửa admin
  const handleEditAdmin = (admin) => {
    setFormData(admin);
    setIsEditing(true);
  };

  // Cập nhật admin
  const handleUpdateAdmin = (e) => {
    e.preventDefault();
    setAdmins(
      admins.map((admin) =>
        admin.id === formData.id ? formData : admin
      )
    );
    setFormData({ id: null, name: "", username: "", email: "" });
    setIsEditing(false);
  };

  // Xóa admin
  const handleDeleteAdmin = (id) => {
    setAdmins(admins.filter((admin) => admin.id !== id));
  };

  return (
    <div style={styles.container}>
      <h2>Quản Lý Admin</h2>

      {/* Form thêm/sửa admin */}
      <form onSubmit={isEditing ? handleUpdateAdmin : handleAddAdmin}>
        <div style={styles.formGroup}>
          <label>Tên:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label>Tên đăng nhập:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.submitButton}>
          {isEditing ? "Cập Nhật Admin" : "Thêm Admin"}
        </button>
      </form>

      {/* Bảng admin */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.tableHeader}>Tên</th>
            <th style={styles.tableHeader}>Tên đăng nhập</th>
            <th style={styles.tableHeader}>Email</th>
            <th style={styles.tableHeader}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin) => (
            <tr key={admin.id}>
              <td style={styles.tableData}>{admin.name}</td>
              <td style={styles.tableData}>{admin.username}</td>
              <td style={styles.tableData}>{admin.email}</td>
              <td style={styles.tableData}>
                <button
                  onClick={() => handleEditAdmin(admin)}
                  style={styles.actionButton}
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleDeleteAdmin(admin.id)}
                  style={styles.deleteButton}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
const styles = {
    container: {
      maxWidth: "800px",
      margin: "0 auto",
      padding: "20px",
    },
    formGroup: {
      marginBottom: "15px",
    },
    input: {
      width: "100%",
      padding: "10px",
      border: "1px solid #ddd",
      borderRadius: "4px",
      fontSize: "16px",
    },
    submitButton: {
      marginTop: "10px",
      padding: "8px 12px",
      backgroundColor: "#4CAF50",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
    },
    table: {
      width: "100%",
      marginTop: "20px",
      borderCollapse: "collapse",
    },
    tableHeader: {
      border: "1px solid #ddd",
      padding: "8px",
    },
    tableData: {
      border: "1px solid #ddd",
      padding: "8px",
    },
    actionButton: {
      marginRight: "5px",
    },
    deleteButton: {
      color: "red",
    },
  };
  

export default Admin;