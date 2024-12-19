import React, { useState, useEffect } from "react";
import axios from "axios";
import Filters from "../components/Filters";

const BlogPage = () => {
  const [blogDataList, setBlogDataList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/blog/get");
        setBlogDataList(response.data);
        setLoading(false);
      } catch (err) {
        setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return <p>Đang tải dữ liệu...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  const sortedBlogDataList = blogDataList.sort(
    (a, b) => new Date(b.createDate) - new Date(a.createDate)
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBlogData = sortedBlogDataList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(blogDataList.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          style={{
            margin: "0 5px",
            padding: "5px 10px",
            backgroundColor: currentPage === i ? "#4CAF50" : "#ddd",
            color: currentPage === i ? "white" : "black",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {i}
        </button>
      );
    }
    return <div style={{ textAlign: "center", marginTop: "20px" }}>{pages}</div>;
  };

  return (
    <>
      <Filters />
      <div style={styles.container}>
        <h1 style={styles.header}>Khám Phá Tin Mới</h1>
        <div style={styles.grid}>
          {currentBlogData.map((blog) => (
            <div key={blog.idBlog} style={styles.blogCard}>
              <div style={styles.imageContainer}>
                <img src={blog.imageBlog} alt={blog.titleBlog} style={styles.image} />
              </div>
              <div style={styles.content}>
                <h1 style={styles.title}>{blog.titleBlog}</h1>
                <p style={styles.author}>
                  <strong>Tác giả:</strong> {blog.author}
                </p>
                <p style={styles.date}>
                  <strong>Ngày tạo:</strong>{" "}
                  {new Date(blog.createDate).toLocaleString()}
                </p>
                <p style={styles.text}>{blog.contentBlog}</p>
              </div>
            </div>
          ))}
        </div>
        {renderPagination()}
      </div>
    </>
  );
};

// CSS trong JavaScript
const styles = {
  container: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    maxWidth: "1200px",
    margin: "auto",
  },
  header: {
    textAlign: "center",
    fontSize: "36px",
    fontWeight: "bold",
    color: "#2e5b2e", // Màu xanh lá cây đậm
    marginBottom: "20px",
  },
  addButton: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginBottom: "20px",
    fontSize: "16px",
  },
  formContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "20px",
    margin:"20px 200px"
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ddd",
    borderRadius: "5px",
  },
  textarea: {
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    height: "100px",
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "30px",
  },
  blogCard: {
    border: "1px solid #ddd",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#fff",
    padding: "15px",
  },
  imageContainer: {
    width: "100%",
    height: "200px",
    overflow: "hidden",
    borderRadius: "10px",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  content: {
    marginTop: "15px",
  },
  title: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "10px",
  },
  author: {
    fontSize: "14px",
    color: "#555",
    marginBottom: "5px",
  },
  date: {
    fontSize: "12px",
    color: "#888",
    marginBottom: "10px",
  },
  text: {
    fontSize: "16px",
    color: "#444",
    lineHeight: "1.6",
  },
};

export default BlogPage;