import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify"; // Import react-toastify
import "react-toastify/dist/ReactToastify.css"; // Import styles for toast notifications

const CateAndSubCRUD = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nameCategory: "",
    subcategoryRequests: [{ nameSubcategory: "" }],
  });
  const [editing, setEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const apiBase = "http://localhost:8080/api/categoriesAndSubcategories";
  const token = localStorage.getItem("token"); // Lấy token từ localStorage

  const axiosInstance = axios.create({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Fetch categories and subcategories
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`${apiBase}/get`);
      setCategories(response.data);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
    setLoading(false);
  };

  // Handle form input changes
  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    if (name === "nameCategory") {
      setFormData({ ...formData, nameCategory: value });
    } else {
      const subcategories = [...formData.subcategoryRequests];
      subcategories[index].nameSubcategory = value;
      setFormData({ ...formData, subcategoryRequests: subcategories });
    }
  };

  // Add a new subcategory field
  const addSubcategory = () => {
    setFormData({
      ...formData,
      subcategoryRequests: [...formData.subcategoryRequests, { nameSubcategory: "" }],
    });
  };

  // Remove a subcategory field
  const removeSubcategory = (index) => {
    const subcategories = [...formData.subcategoryRequests];
    subcategories.splice(index, 1);
    setFormData({ ...formData, subcategoryRequests: subcategories });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        // Update category logic (Tùy API hỗ trợ)
        toast.success("Chỉnh sửa chưa được hỗ trợ trong API này.");
      } else {
        await axiosInstance.post(`${apiBase}/add`, formData);
        toast.success("Thêm thành công!");
      }
      fetchCategories();
      setFormData({ nameCategory: "", subcategoryRequests: [{ nameSubcategory: "" }] });
      setEditing(false);
      setShowForm(false);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  // Pagination handlers
  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const currentCate = categories.slice(
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
      <h1 className="text-2xl font-bold mb-4 text-center">Quản lý Danh Mục & Danh Mục Con</h1>
      <button style={{ ...styles.button, ...styles.btnAdd }} onClick={() => setShowForm(true)}>
        + Thêm Danh Mục
      </button>

      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <div>
          <table style={styles.table}>
          <thead>
            <tr>
              <th style={{ ...styles.thTd, ...styles.th }}>ID</th>
              <th style={{ ...styles.thTd, ...styles.th }}>Tên Danh Mục</th>
              <th style={{ ...styles.thTd, ...styles.th }}>Danh Mục Con</th>
            </tr>
          </thead>
          <tbody>
            {currentCate.map((category) => (
              <tr key={category.idCategory}>
                <td style={styles.thTd}>{category.idCategory}</td>
                <td style={styles.thTd}>{category.nameCategory}</td>
                <td style={styles.thTd}>
                  <ul>
                    {category.subcategoriesResponses.map((sub) => (
                      <li key={sub.idSubcategory}>{sub.nameSubcategory}</li>
                    ))}
                  </ul>
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

      {showForm && (
        <>
          <div style={styles.overlay} onClick={() => setShowForm(false)} />
          <div style={styles.modal}>
            <button style={styles.closeButton} onClick={() => setShowForm(false)}>
              &times;
            </button>
            <form onSubmit={handleSubmit}>
              <h2 style={styles.formHeading}>
                {editing ? "Cập nhật Danh Mục" : "Thêm Danh Mục"}
              </h2>
              <label style={styles.label}>Tên Danh Mục:</label>
              <input
                style={styles.input}
                type="text"
                name="nameCategory"
                value={formData.nameCategory}
                onChange={handleInputChange}
                required
              />
              <label style={styles.label}>Danh Mục Con:</label>
              {formData.subcategoryRequests.map((sub, index) => (
                <div key={index} style={styles.subcategoryRow}>
                  <input
                    style={styles.input}
                    type="text"
                    name={`subcategory-${index}`}
                    value={sub.nameSubcategory}
                    onChange={(e) => handleInputChange(e, index)}
                    required
                  />
                </div>
              ))}
              <button
                style={{ ...styles.button, ...styles.btnAdd }}
                type="button"
                onClick={addSubcategory}
              >
                + Thêm Danh Mục Con
              </button>
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
                  onClick={() => setShowForm(false)}
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
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f9f9f9',
      paddingTop: '4rem', // Thêm padding-top
  },
  table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '20px',
  },
  thTd: {
      padding: '10px',
      textAlign: 'center',
      border: '1px solid #ddd',
  },
  th: {
      backgroundColor: '#6cbb3c',
      color: 'white',
  },
  image: {
      width: '120px',
      height: '80px',
      objectFit: 'cover',
      display: "block", // Để căn giữa
  margin: "auto", // Căn giữa hình ảnh
  },
  button: {
      padding: '10px 20px',
      margin: '5px',
      border: 'none',
      cursor: 'pointer',
      borderRadius: '5px',
      fontWeight: 'bold',
  },
  btnAdd: {
      backgroundColor: '#6cbb3c',
      color: 'white',
  },
  btnEdit: {
      backgroundColor: '#f0ad4e',
      color: 'white',
  },
  btnDelete: {
      backgroundColor: '#d9534f',
      color: 'white',
  },
  modal: {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      background: 'white',
      padding: '30px',
      borderRadius: '10px',
      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
      zIndex: 1000,
      width: '400px',
      maxWidth: '90%',
  },
  overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 999,
  },
  formHeading: {
      marginBottom: '20px',
      textAlign: 'center',
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#333',
  },
  label: {
      display: 'block',
      marginBottom: '8px',
      fontWeight: 'bold',
      color: '#555',
  },
  input: {
      width: '100%',
      padding: '10px',
      marginBottom: '15px',
      borderRadius: '5px',
      border: '1px solid #ccc',
  },
  formActions: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: '10px',
  },
  cancelButton: {
      backgroundColor: '#ccc',
      color: '#333',
  },
  closeButton: {
      position: 'absolute',
      top: '10px',
      right: '10px',
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
      fontSize: '20px',
      color: '#888',
  },
  pagination: { display: "flex", justifyContent: "center", marginTop: "20px", alignItems: "center", gap: "10px" },
  btnPage: { backgroundColor: "#6cbb3c", color: "white" },
};


export default CateAndSubCRUD;