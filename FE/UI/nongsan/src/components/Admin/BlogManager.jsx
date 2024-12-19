import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BlogManager = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    idBlog: "",
    title: "",
    content: "",
    imageBlog: null,
  });
  const [editing, setEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [expandedBlogs, setExpandedBlogs] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false); // State for delete modal visibility
  const [selectedBlogId, setSelectedBlogId] = useState(null); // State for selected blog to delete

  const apiBase = "http://localhost:8080/api/blog";
  const token = localStorage.getItem("token");

  const axiosInstance = axios.create({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`${apiBase}/get`);
      setBlogs(response.data);
    } catch (error) {
      console.error("Lỗi khi tải bài viết:", error.response || error);
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

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
        toast.success("Cập nhật bài viết thành công!");
      } else {
        await axiosInstance.post(`${apiBase}/add`, form);
        toast.success("Thêm bài viết mới thành công!");
      }
      fetchBlogs();
      resetForm();
    } catch (error) {
      console.error("Lỗi khi gửi biểu mẫu:", error.response || error);
    }
  };

  const resetForm = () => {
    setFormData({ idBlog: "", title: "", content: "", imageBlog: null });
    setEditing(false);
    setShowForm(false);
  };

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

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`${apiBase}/delete/${id}`);
      toast.success("Xóa bài viết thành công!");
      setShowDeleteModal(false); // Close the modal after deleting
      fetchBlogs();
    } catch (error) {
      console.error("Lỗi khi xóa bài viết:", error.response || error);
    }
  };

  const toggleExpand = (id) => {
    setExpandedBlogs((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const truncateText = (text, length) => {
    if (text.length > length) {
      return `${text.substring(0, length)}...`;
    }
    return text;
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
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
      <h1 className="text-2xl font-bold mb-4 text-center">Quản lí bài viết</h1>
      <button
        style={{ ...styles.button, ...styles.btnAdd }}
        onClick={() => setShowForm(true)}
      >
        + Thêm bài viết
      </button>

      {loading ? (
        <p>Đang tải...</p>
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
                    onClick={() => {
                      setSelectedBlogId(blog.idBlog);
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
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <button style={styles.closeButton} onClick={() => setShowDeleteModal(false)}>
              &times;
            </button>
            <h3 style={styles.formHeading}>Bạn có chắc chắn muốn xóa bài viết này không?</h3>
            <div style={styles.formActions}>
              <button
                style={{ ...styles.button, ...styles.btnDelete }}
                onClick={() => handleDelete(selectedBlogId)}
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
          <div style={styles.overlay} onClick={resetForm} aria-hidden="true" />
          <div style={styles.modal} aria-modal="true" role="dialog">
            <button style={styles.closeButton} onClick={resetForm}>
              &times;
            </button>
            <form onSubmit={handleSubmit}>
              <h2 style={styles.formHeading}>
                {editing ? "Chỉnh sửa bài viết" : "Thêm bài viết"}
              </h2>
              <label style={styles.label}>Chủ đề:</label>
              <input
                style={styles.input}
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
              <label style={styles.label}>Nội dung:</label>
              <textarea
                style={styles.input}
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                required
              />
              <label style={styles.label}>Ảnh:</label>
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
    paddingTop: "4rem",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
    tableLayout: "fixed",
  },
  thTd: {
    padding: "10px",
    textAlign: "center",
    border: "1px solid #ddd",
    overflow: "hidden",
    textOverflow: "ellipsis",
    verticalAlign: "middle",
  },
  image: {
    width: "100px",
    height: "100px",
    objectFit: "cover",
    borderRadius: "5px",
    border: "1px solid #ddd",
    display: "block",
    margin: "auto",
  },
  button: {
    padding: "8px 15px",
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
    width: "400px",
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
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "5px",
    border: "1px solid #ccc",
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
