import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const BlogDetail = () => {
  const { id } = useParams(); // Lấy ID từ URL
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(false);

  const apiBase = "http://localhost:8080/api/blog";
  const token = localStorage.getItem("token");

  const axiosInstance = axios.create({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const fetchBlogDetail = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`${apiBase}/get/${id}`);
      setBlog(response.data);
    } catch (error) {
      console.error("Error fetching blog details:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBlogDetail();
  }, [id]);

  if (loading) {
    return <p style={styles.loading}>Đang tải chi tiết bài viết...</p>;
  }

  if (!blog) {
    return <p style={styles.error}>Bài viết không tồn tại hoặc đã bị xóa.</p>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.heroSection}>
        <h1 style={styles.title}>{blog.titleBlog}</h1>
        <p style={styles.date}>Ngày tạo: {new Date(blog.createDate).toLocaleDateString()}</p>
        <p style={styles.author}>Tác giả: {blog.author}</p>
      </div>
      <div style={styles.imageWrapper}>
        <img src={blog.imageBlog} alt={blog.titleBlog} style={styles.image} />
      </div>
      <div style={styles.contentWrapper}>
        <p style={styles.content}>{blog.contentBlog}</p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "30px",
    backgroundColor: "#f7f7f7",
    borderRadius: "12px",
    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
    transition: "all 0.3s ease",
  },
  heroSection: {
    backgroundColor: "#ffffff",
    color: "#333",
    padding: "40px 30px",
    borderRadius: "12px",
    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.1)",
    marginBottom: "30px",
    textAlign: "center",
    transition: "all 0.3s ease",
  },
  title: {
    fontSize: "42px",
    fontWeight: "700",
    color: "#2d572c",
    marginBottom: "15px",
    lineHeight: "1.4",
  },
  date: {
    fontSize: "16px",
    color: "#888",
    fontWeight: "500",
    marginBottom: "10px",
  },
  author: {
    fontSize: "18px",
    color: "#555",
    fontWeight: "400",
    marginTop: "5px",
  },
  imageWrapper: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "30px",
  },
  image: {
    width: "100%", // Set the width to 100% of the heroSection's width
    height: "auto",
    borderRadius: "12px",
    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    maxWidth: "100%", // Ensure it does not exceed the width of the container
  },
  contentWrapper: {
    padding: "0 30px",
  },
  content: {
    fontSize: "18px",
    color: "#333",
    lineHeight: "1.8",
    textAlign: "justify",
    marginBottom: "30px",
  },
  loading: {
    textAlign: "center",
    fontSize: "20px",
    color: "#ff7f50",
    fontWeight: "600",
  },
  error: {
    textAlign: "center",
    fontSize: "20px",
    color: "#ff6347",
    fontWeight: "600",
  },
};

export default BlogDetail;
