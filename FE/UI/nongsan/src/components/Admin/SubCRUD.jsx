import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify"; // Import react-toastify
import "react-toastify/dist/ReactToastify.css"; // Import styles for toast notifications

const SubCRUD = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ nameSubcategory: "" });
  const [editing, setEditing] = useState(false);
  const [currentSubcategoryId, setCurrentSubcategoryId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [categoryId, setCategoryId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // State for delete modal visibility
  const [selectedSubId, setSelectedSubId] = useState(null);
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const apiBase = "http://localhost:8080/api/subcategories";
  const categoryApiBase = "http://localhost:8080/api/categories";
  const token = localStorage.getItem("token");

  const axiosInstance = axios.create({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get(`${categoryApiBase}/get`);
      setCategories(response.data);
      if (response.data.length > 0) {
        setCategoryId(response.data[0].idCategory); // Set default category ID
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Fetch subcategories for a specific category
  const fetchSubcategories = async () => {
    if (!categoryId) return;
    setLoading(true);
    try {
      const response = await axiosInstance.get(`${apiBase}/get/${categoryId}`);
      setSubcategories(response.data);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
    setLoading(false);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        // Update subcategory
        await axiosInstance.put(
          `${apiBase}/update/${currentSubcategoryId}`,
          formData
        );
        toast.success("Cập nhật danh mục con thành công!");
      } else {
        // Add subcategory
        await axiosInstance.post(`${apiBase}/add/${categoryId}`, formData);
        toast.success("Thêm danh mục con thành công!");
      }
      fetchSubcategories();
      resetForm();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  // Handle delete subcategory
  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`${apiBase}/delete/${id}`);
      toast.success("Xóa danh mục con thành công!");
      setShowDeleteModal(false); // Close the modal after deleting
      fetchSubcategories();
    } catch (error) {
      console.error("Error deleting subcategory:", error);
    }
  };

  // Reset form and state
  const resetForm = () => {
    setFormData({ nameSubcategory: "" });
    setEditing(false);
    setCurrentSubcategoryId(null);
    setShowForm(false);
  };

  // Set form for editing
  const handleEdit = (subcategory) => {
    setFormData({ nameSubcategory: subcategory.nameSubcategory });
    setEditing(true);
    setCurrentSubcategoryId(subcategory.idSubcategory);
    setShowForm(true);
  };

  // Pagination handlers
  const totalPages = Math.ceil(subcategories.length / itemsPerPage);
  const currentItems = subcategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchSubcategories();
  }, [categoryId]);

  return (
    <div style={styles.container}>
      <ToastContainer
        position="bottom-left" // Hiển thị thông báo ở góc dưới bên trái
        autoClose={3000} // Thời gian tự động đóng (ms)
        hideProgressBar={false} // Hiển thị thanh tiến trình
        newestOnTop={false} // Thông báo mới nhất không hiển thị trên cùng
        closeOnClick // Đóng thông báo khi click
        rtl={false} // Không dùng chế độ RTL
        pauseOnFocusLoss // Tạm dừng khi mất tiêu điểm
        draggable // Có thể kéo thông báo
        pauseOnHover // Tạm dừng khi hover vào thông báo
      />
      <h1 className="text-2xl font-bold mb-4 text-center">
        Quản lý Danh Mục Con
      </h1>

      <div style={styles.categorySelect}>
        <label>Chọn danh mục: </label>
        <select
          value={categoryId || ""}
          onChange={(e) => setCategoryId(e.target.value)}
          style={styles.input}
        >
          {categories.map((category) => (
            <option key={category.idCategory} value={category.idCategory}>
              {category.nameCategory}
            </option>
          ))}
        </select>
      </div>

      <button
        style={{ ...styles.button, ...styles.btnAdd }}
        onClick={() => setShowForm(true)}
      >
        + Thêm Danh Mục Con
      </button>

      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <div>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={{ ...styles.thTd, ...styles.th }}>ID</th>
                <th style={{ ...styles.thTd, ...styles.th }}>
                  Tên Danh Mục Con
                </th>
                <th style={{ ...styles.thTd, ...styles.th }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((subcategory) => (
                <tr key={subcategory.idSubcategory}>
                  <td style={styles.thTd}>{subcategory.idSubcategory}</td>
                  <td style={styles.thTd}>{subcategory.nameSubcategory}</td>
                  <td style={styles.thTd}>
                    <button
                      style={{ ...styles.button, ...styles.btnEdit }}
                      onClick={() => handleEdit(subcategory)}
                    >
                      Sửa
                    </button>
                    <button
                      style={{ ...styles.button, ...styles.btnDelete }}
                      onClick={() => {
                        setSelectedSubId(subcategory.idSubcategory);
                        setShowDeleteModal(true);
                      }}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={styles.pagination}>
            <button
              style={{ ...styles.button, ...styles.btnPage }}
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              Trước
            </button>
            <span>
              Trang {currentPage} / {totalPages}
            </span>
            <button
              style={{ ...styles.button, ...styles.btnPage }}
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Tiếp
            </button>
          </div>
        </div>
      )}
      {showDeleteModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <button
              style={styles.closeButton}
              onClick={() => setShowDeleteModal(false)}
            >
              &times;
            </button>
            <h3 style={styles.formHeading}>
              Bạn có chắc chắn muốn xóa danh mục phụ này không?
            </h3>
            <div style={styles.formActions}>
              <button
                style={{ ...styles.button, ...styles.btnDelete }}
                onClick={() => handleDelete(selectedSubId)}
              >
                Xóa
              </button>
              <button
                style={{ ...styles.button, ...styles.cancelButton }}
                onClick={() => setShowDeleteModal(false)}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <>
          <div style={styles.overlay} onClick={resetForm} />
          <div style={styles.modal}>
            <button style={styles.closeButton} onClick={resetForm}>
              &times;
            </button>
            <form onSubmit={handleSubmit}>
              <h2 style={styles.formHeading}>
                {editing ? "Cập nhật Danh Mục Con" : "Thêm Danh Mục Con"}
              </h2>
              <label style={styles.label}>Tên Danh Mục Con:</label>
              <input
                style={styles.input}
                type="text"
                name="nameSubcategory"
                value={formData.nameSubcategory}
                onChange={handleInputChange}
                required
              />
              <div style={styles.formActions}>
                <button
                  style={{ ...styles.button, ...styles.btnAdd }}
                  type="submit"
                >
                  {editing ? "Cập nhật" : "Thêm"}
                </button>
                <button
                  style={{ ...styles.button, ...styles.cancelButton }}
                  type="button"
                  onClick={resetForm}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f9f9f9",
    paddingTop: "5rem",
  },
  table: { width: "100%", borderCollapse: "collapse", marginTop: "20px" },
  thTd: { padding: "10px", textAlign: "center", border: "1px solid #ddd" },
  th: { backgroundColor: "#6cbb3c", color: "white" },
  button: {
    padding: "10px 20px",
    margin: "5px",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
    fontWeight: "bold",
  },
  btnAdd: { backgroundColor: "#6cbb3c", color: "white" },
  btnEdit: { backgroundColor: "#f0ad4e", color: "white" },
  btnDelete: { backgroundColor: "#d9534f", color: "white" },
  modal: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    background: "white",
    padding: "30px",
    borderRadius: "10px",
    zIndex: 1000,
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 999,
  },
  formHeading: {
    marginBottom: "20px",
    textAlign: "center",
    fontSize: "20px",
    fontWeight: "bold",
  },
  label: { display: "block", marginBottom: "8px", fontWeight: "bold" },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  formActions: {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
  },
  cancelButton: { backgroundColor: "#ccc", color: "#333" },
  closeButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: "20px",
  },
  categorySelect: { marginBottom: "20px" },
  pagination: {
    display: "flex",
    justifyContent: "center",
    marginTop: "20px",
    alignItems: "center",
    gap: "10px",
  },
  btnPage: { backgroundColor: "#6cbb3c", color: "white" },
};

export default SubCRUD;
