import React, { useState, useEffect } from "react";
import axios from "axios";

const BlogManager = () => {
  // State variables
  const [blogs, setBlogs] = useState([]); // Blog list
  const [loading, setLoading] = useState(false); // Loading indicator
  const [formData, setFormData] = useState({
    idBlog: "",
    title: "",
    content: "",
    imageBlog: null,
  }); // Form data for add/edit
  const [editing, setEditing] = useState(false); // Edit mode flag
  const [showForm, setShowForm] = useState(false); // Form visibility flag
  const [expandedBlogs, setExpandedBlogs] = useState({}); // Trạng thái theo dõi "xem thêm"

  // API endpoint and token
  const apiBase = "http://localhost:8080/api/blog";
  const token = localStorage.getItem("token"); // Token from localStorage

  // Axios instance with authorization header
  const axiosInstance = axios.create({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Fetch blogs from API
  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`${apiBase}/get`);
      setBlogs(response.data);
    } catch (error) {
      console.error("Error fetching blogs:", error.response || error);
    }
    setLoading(false);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("title", formData.title);
    form.append("content", formData.content);
    if (formData.imageBlog) {
      form.append("imageBlog", formData.imageBlog);
    }

    try {
      if (editing) {
        await axiosInstance.put(`${apiBase}/update/${formData.idBlog}`, form);
        alert("Blog updated successfully!");
      } else {
        await axiosInstance.post(`${apiBase}/add`, form);
        alert("Blog added successfully!");
      }
      fetchBlogs();
      resetForm();
    } catch (error) {
      console.error("Error submitting form:", error.response || error);
    }
  };

  // Reset form data
  const resetForm = () => {
    setFormData({ idBlog: "", title: "", content: "", imageBlog: null });
    setEditing(false);
    setShowForm(false);
  };

  // Handle edit button click
  const handleEdit = (blog) => {
    setFormData({
      idBlog: blog.idBlog,
      title: blog.titleBlog,
      content: blog.contentBlog,
      imageBlog: null,
    });
    setEditing(true);
    setShowForm(true);
  };

  // Handle delete button click
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        await axiosInstance.delete(`${apiBase}/delete/${id}`);
        alert("Blog deleted successfully!");
        fetchBlogs();
      } catch (error) {
        console.error("Error deleting blog:", error.response || error);
      }
    }
  };

  // Hàm chuyển đổi trạng thái "xem thêm"
  const toggleExpand = (id) => {
    setExpandedBlogs((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Hàm cắt ngắn nội dung
  const truncateText = (text, length) => {
    if (text.length > length) {
      return `${text.substring(0, length)}...`;
    }
    return text;
  };
  // Fetch blogs on component mount
  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div style={styles.container}>
      <h1 className="text-2xl font-bold mb-4 text-center">Quản lí bài viết</h1>
      <button
        style={{ ...styles.button, ...styles.btnAdd }}
        onClick={() => setShowForm(true)}
      >
        + Thêm bài viết
      </button>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.thTd}>ID</th>
              <th style={styles.thTd}>Chủ đề</th>
              <th style={styles.thTd}>Nội dung</th>
              <th style={styles.thTd}>Ảnh</th>
              <th style={styles.thTd}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog) => (
              <tr key={blog.idBlog}>
                <td style={styles.thTd}>{blog.idBlog}</td>
                <th style={styles.thTd}>{blog.titleBlog}</th>
 
                <td style={styles.thTd}>
                  {expandedBlogs[blog.idBlog]
                    ? blog.contentBlog
                    : truncateText(blog.contentBlog, 50)}
                  <button
                    style={styles.toggleButton}
                    onClick={() => toggleExpand(blog.idBlog)}
                  >
                    {expandedBlogs[blog.idBlog] ? "Ẩn bớt" : "Xem thêm"}
                  </button>
                </td>
                <td style={{ ...styles.thTd, textAlign: "center" }}>
                  <img
                    src={blog.imageBlog}
                    alt={blog.titleBlog}
                    style={styles.image}
                  />
                </td>
                <td style={styles.thTd}>
                  <button
                    style={{ ...styles.button, ...styles.btnEdit }}
                    onClick={() => handleEdit(blog)}
                  >
                    Sửa
                  </button>
                  <button
                    style={{ ...styles.button, ...styles.btnDelete }}
                    onClick={() => handleDelete(blog.idBlog)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showForm && (
        <>
          <div style={styles.overlay} onClick={resetForm} aria-hidden="true" />
          <div style={styles.modal} aria-modal="true" role="dialog">
            <button style={styles.closeButton} onClick={resetForm}>
              &times;
            </button>
            <form onSubmit={handleSubmit}>
              <h2 style={styles.formHeading}>
                {editing ? "Edit Blog" : "Add Blog"}
              </h2>
              <label style={styles.label}>Title:</label>
              <input
                style={styles.input}
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
              <label style={styles.label}>Content:</label>
              <textarea
                style={styles.input}
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                required
              />
              <label style={styles.label}>Image:</label>
              <input
                style={styles.input}
                type="file"
                name="imageBlog"
                onChange={handleInputChange}
              />
              <div style={styles.formActions}>
                <button
                  style={{ ...styles.button, ...styles.btnAdd }}
                  type="submit"
                >
                  {editing ? "Update" : "Add"}
                </button>
                <button
                  style={{ ...styles.button, ...styles.cancelButton }}
                  type="button"
                  onClick={resetForm}
                >
                  Cancel
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
    paddingTop: "4rem", // Thêm khoảng cách phía trên
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
    tableLayout: "fixed", // Đảm bảo các cột có kích thước cố định
  },
  thTd: {
    padding: "10px",
    textAlign: "center",
    border: "1px solid #ddd",
    // whiteSpace: 'nowrap', // Ngăn nội dung bị xuống dòng
    overflow: "hidden",
    textOverflow: "ellipsis", // Cắt ngắn nội dung dài
    verticalAlign: "middle",
  },
  th: {
    backgroundColor: "#6cbb3c",
    color: "white",
  },
  image: {
    width: "100px", // Đảm bảo kích thước cố định
    height: "100px",
    objectFit: "cover", // Giúp hình ảnh không bị méo
    borderRadius: "5px", // Bo tròn nhẹ các góc
    border: "1px solid #ddd",
    display: "block", // Để căn giữa
    margin: "auto", // Căn giữa hình ảnh
  },
  button: {
    padding: "8px 15px", // Đồng bộ kích thước
    fontSize: "14px",
    margin: "5px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
  },
  btnAdd: {
    backgroundColor: "#6cbb3c",
    color: "white",
  },
  btnEdit: {
    backgroundColor: "#f0ad4e",
    color: "white",
  },
  btnDelete: {
    backgroundColor: "#d9534f",
    color: "white",
  },
  modal: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
    zIndex: 1000,
    width: "400px", // Giới hạn chiều rộng
    maxWidth: "90%",
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
    color: "#333",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "bold",
    color: "#555",
  },
  input: {
    width: "100%", // Trường nhập liệu có cùng chiều rộng
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    boxSizing: "border-box", // Đảm bảo padding không làm vỡ layout
  },
  textarea: {
    width: "100%", // Đồng bộ với input
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    height: "100px",
    boxSizing: "border-box",
  },
  formActions: {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
  },
  cancelButton: {
    backgroundColor: "#ccc",
    color: "#333",
  },
  closeButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: "20px",
    color: "#888",
  },
  toggleButton: {
    display: "block",
    marginTop: "5px",
    padding: "5px 10px",
    fontSize: "12px",
    backgroundColor: "#6cbb3c",
    color: "white",
    border: "none",
    borderRadius: "3px",
    cursor: "pointer",
  },
};

export default BlogManager;
