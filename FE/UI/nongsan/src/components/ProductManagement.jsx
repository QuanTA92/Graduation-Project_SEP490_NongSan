import React, { useState, useEffect } from "react";
import FarmerProductForm from "./FarmerProductForm";
import { useNavigate } from "react-router-dom"; // Import useNavigate instead of useHistory
import ProductService from "../services/ProductService"; // Import the ProductService class
import WalletHouse from "../services/WalletHouse"; // Import WalletHouse

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate(); // useNavigate instead of useHistory
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5; // Số sản phẩm trên mỗi trang

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token"); // Lấy token từ localStorage
        if (!token) {
          console.error("No token found, cannot fetch products");
          return;
        }

        const response = await ProductService.getProductByHouseHoldId(token); // Gọi API mới
        setProducts(response.data); // Gán danh sách sản phẩm vào state
      } catch (error) {
        console.error("Error fetching products by household:", error);
      }
    };
    fetchProducts();
  }, []);

  // Tính toán sản phẩm hiển thị
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  // Tổng số trang
  const totalPages = Math.ceil(products.length / productsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleFirstPage = () => {
    setCurrentPage(1);
  };

  const handleLastPage = () => {
    setCurrentPage(totalPages);
  };

  const handleAddProduct = (newProduct) => {
    setProducts([...products, { id: products.length + 1, ...newProduct }]);
    setShowForm(false);
  };

  const handleEditProduct = (updatedProduct) => {
    setProducts(
      products.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product
      )
    );
    setEditingProduct(null);
    setShowForm(false);
  };

  // Modify the deleteProduct function to use ProductService
  const handleDeleteProduct = async (productId) => {
    const token = localStorage.getItem("token"); // Retrieve the token from localStorage

    if (!token) {
      console.error("No token found, cannot delete product");
      return;
    }

    // Show a confirmation dialog before proceeding with deletion
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (isConfirmed) {
      try {
        // Call deleteProduct from ProductService
        await ProductService.deleteProduct(productId, token);
        // Remove product from state after successful deletion
        setProducts(
          products.filter((product) => product.idProduct !== productId)
        );
        console.log("Product deleted successfully");
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    } else {
      console.log("Product deletion was canceled.");
    }
  };

  // const openEditForm = (product) => {
  //   setEditingProduct(product);
  //   setShowForm(true);
  // };

  const openAddForm = async () => {
    const token = localStorage.getItem("token"); // Lấy token từ localStorage
    
    if (!token) {
      console.error("No token found. User must log in first.");
      return;
    }
    
    try {
      const response = await WalletHouse.checkWallet(token);
      console.log("Phản hồi từ API: ", response); // In ra toàn bộ phản hồi
      console.log("Dữ liệu từ API: ", response.data); // In ra dữ liệu cụ thể
  
      // Kiểm tra dữ liệu trả về từ API
      if (response.data === "Wallet has already been created.") {
        navigate("/add"); // Nếu ví đã được tạo, chuyển hướng đến trang thêm sản phẩm
      } else {
        alert("Bạn phải tạo ví trước khi sử dụng.");
        navigate("/create-wallet");
      }
    } catch (error) {
      console.error("Lỗi khi kiểm tra ví:", error);
    }
  };
  

  function updateProduct(id) {
    navigate(`/update/${id}`);
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Quản lí sản phẩm</h2>
      <button onClick={openAddForm} style={styles.addButton}>
        Thêm sản phẩm
      </button>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.tableCell}>ID</th>
            <th style={styles.tableCell}>Tên sản phẩm</th>
            <th style={styles.tableCell}>Giá (VND)</th>
            <th style={styles.tableCell}>Số lượng</th>
            <th style={styles.tableCell}>Trạng thái</th>
            <th style={styles.tableCell}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {currentProducts.map((product) => (
            <tr key={product.idProduct}>
              <td style={styles.tableCell}>{product.idProduct}</td>
              <td style={styles.tableCell}>{product.nameProduct}</td>
              <td style={styles.tableCell}>
                {" "}
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(product.priceProduct)}
              </td>
              <td style={styles.tableCell}>{product.quantityProduct}</td>
              <td style={styles.tableCell}>{product.statusProduct}</td>
              <td style={styles.tableCell}>
                <button
                  onClick={() => updateProduct(product.idProduct)}
                  style={styles.editButton}
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleDeleteProduct(product.idProduct)} // Use handleDeleteProduct
                  style={styles.deleteButton}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Điều hướng phân trang */}
      <div style={styles.pagination}>
              <button
                style={styles.paginationButton}
                onClick={handleFirstPage}
                disabled={currentPage === 1}
              >
                Tới Đầu Trang
              </button>
              <button
                style={styles.paginationButton}
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                Trước
              </button>
              <span style={styles.paginationInfo}>
                Trang {currentPage} / {totalPages}
              </span>
              <button
                style={styles.paginationButton}
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Tiếp
              </button>
              <button
                style={styles.paginationButton}
                onClick={handleLastPage}
                disabled={currentPage === totalPages}
              >
                Tới Cuối Trang
              </button>
            </div>

      {showForm && (
        <div style={styles.formOverlay}>
          <div style={styles.formContainer}>
            <FarmerProductForm
              initialData={editingProduct}
              onSave={editingProduct ? handleEditProduct : handleAddProduct}
            />
            <button
              onClick={() => setShowForm(false)}
              style={styles.cancelButton}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "20px 40px",
    fontFamily: "Arial, sans-serif",
    minHeight: "55vh",
  },
  header: {
    fontSize: "24px",
    color: "#333",
    marginBottom: "20px",
  },
  addButton: {
    padding: "10px 15px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginBottom: "20px",
    transition: "background-color 0.3s",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "white",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
    overflow: "hidden",
  },
  tableCell: {
    padding: "10px",
    textAlign: "center",
    borderBottom: "1px solid #ddd",
    width: "16.6%",
  },
  row: {
    transition: "background-color 0.3s",
  },
  editButton: {
    backgroundColor: "#FFC107",
    color: "white",
    border: "none",
    padding: "5px 10px",
    marginRight: "5px",
    cursor: "pointer",
    borderRadius: "4px",
    transition: "background-color 0.3s",
  },
  deleteButton: {
    backgroundColor: "#F44336",
    color: "white",
    border: "none",
    padding: "5px 10px",
    cursor: "pointer",
    borderRadius: "4px",
    transition: "background-color 0.3s",
  },
  formOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  formContainer: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    width: "600px",
    maxWidth: "100%",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
  },
  cancelButton: {
    padding: "10px 15px",
    backgroundColor: "#CCCCCC",
    color: "#333",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "10px",
  },
  // Các style khác giữ nguyên...
  pagination: {
    marginTop: "20px",
    textAlign: "center",
  },
  paginationButton: {
    padding: "10px 20px",
    margin: "0 10px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#388e3c",
    color: "#fff",
    cursor: "pointer",
    fontSize: "14px",
  },
  paginationButtonDisabled: {
    backgroundColor: "#ccc",
    cursor: "not-allowed",
  },
  paginationInfo: {
    fontSize: "16px",
    fontWeight: "bold",
  },
};

export default ProductManagement;
