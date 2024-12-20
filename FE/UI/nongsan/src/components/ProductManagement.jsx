import React, { useState, useEffect } from "react";
import FarmerProductForm from "./FarmerProductForm";
import { useNavigate } from "react-router-dom";
import ProductService from "../services/ProductService";
import WalletHouse from "../services/WalletHouse";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-modal"; // Hoặc thư viện khác bạn muốn dùng

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found, cannot fetch products");
          return;
        }

        const response = await ProductService.getProductByHouseHoldId(token);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products by household:", error);
      }
    };
    fetchProducts();
  }, []);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
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

  const openConfirmDialog = (productId) => {
    setProductToDelete(productId);
    setShowConfirmDialog(true);
  };

  const closeConfirmDialog = () => {
    setProductToDelete(null);
    setShowConfirmDialog(false);
  };

  const handleDeleteProduct = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found, cannot delete product");
      return;
    }

    try {
      await ProductService.deleteProduct(productToDelete, token);
      setProducts(products.filter((product) => product.idProduct !== productToDelete));
      toast.success("Xóa sản phẩm thành công!");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Lỗi khi xóa sản phẩm.");
    } finally {
      closeConfirmDialog();
    }
  };

  const openAddForm = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found. User must log in first.");
      return;
    }

    try {
      const response = await WalletHouse.checkWallet(token);
      if (response.data === "Wallet has already been created.") {
        navigate("/add");
      } else {
        toast.warning("Bạn phải tạo ví trước khi sử dụng.", {
          position: "bottom-left",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnFocusLoss: true,
          draggable: true,
          pauseOnHover: true,
        });

        setTimeout(() => {
          navigate("/create-wallet");
        }, 3000);
      }
    } catch (error) {
      console.error("Lỗi khi kiểm tra ví:", error);
    }
  };

  const updateProduct = (id) => {
    navigate(`/update/${id}`);
  };

  const openModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

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
            <th style={styles.tableCell}>Chi tiết</th>

          </tr>
        </thead>
        <tbody>
          {currentProducts.map((product) => (
            <tr key={product.idProduct}>
              <td style={styles.tableCell}>{product.idProduct}</td>
              <td style={styles.tableCell}>{product.nameProduct}</td>
              <td style={styles.tableCell}>
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(product.priceProduct)}
              </td>
              <td style={styles.tableCell}>{product.quantityProduct}kg</td>
              <td style={styles.tableCell}>{product.statusProduct}</td>
              <td style={styles.tableCell}>
                <button
                  onClick={() => updateProduct(product.idProduct)}
                  style={styles.editButton}
                >
                  Sửa
                </button>
                <button
                  onClick={() => openConfirmDialog(product.idProduct)}
                  style={styles.deleteButton}
                >
                  Xóa
                </button>
              </td>
              <td style={styles.tableCell}>
                <button onClick={() => openModal(product)}>👁️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Popup hiển thị chi tiết sản phẩm */}
      {selectedProduct && isModalOpen && (
  <div style={styles.popupOverlay}>
    <div style={styles.popupContainer}>
      <h2 style={styles.modalHeader}>Chi tiết sản phẩm</h2>
      <div style={styles.modalContent}>
        <table style={styles.detailTable}>
          <tbody>
            <tr>
              <td style={styles.detailLabel}>Tên sản phẩm:</td>
              <td style={styles.detailValue}>{selectedProduct.nameProduct}</td>
            </tr>
            <tr>
              <td style={styles.detailLabel}>Mô tả:</td>
              <td style={styles.detailValue}>{selectedProduct.descriptionProduct}</td>
            </tr>
            <tr>
              <td style={styles.detailLabel}>Giá:</td>
              <td style={styles.detailValue}>
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(selectedProduct.priceProduct)}
              </td>
            </tr>
            {selectedProduct.imageProducts.length > 0 && (
              <tr>
                <td style={styles.detailLabel}>Hình ảnh:</td>
                <td style={styles.imageContainer}>
                  <img
                    src={selectedProduct.imageProducts[0]}
                    alt={selectedProduct.nameProduct}
                    style={styles.modalImage}
                  />
                </td>
              </tr>
            )}
            <tr>
              <td style={styles.detailLabel}>Hạn sử dụng:</td>
              <td style={styles.detailValue}>{selectedProduct.expirationDate}</td>
            </tr>
            <tr>
              <td style={styles.detailLabel}>Địa chỉ:</td>
              <td style={styles.detailValue}>{selectedProduct.specificAddressProduct},{selectedProduct.wardProduct},{selectedProduct.districtProduct},{selectedProduct.cityProduct}</td>
            </tr>
            <tr>
              <td style={styles.detailLabel}>Chất lượng:</td>
              <td style={styles.detailValue}>{selectedProduct.qualityCheck}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <button onClick={closeModal} style={styles.closeButton}>Đóng</button>
    </div>
  </div>
)}


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

      {showConfirmDialog && (
        <div style={styles.confirmOverlay}>
          <div style={styles.confirmDialog}>
            <h3 style={styles.confirmTitle}>Xác nhận xóa sản phẩm</h3>
            <p style={styles.confirmMessage}>Bạn có chắc chắn muốn xóa sản phẩm này?</p>
            <div style={styles.confirmActions}>
              <button onClick={handleDeleteProduct} style={styles.confirmButton}>
                Có
              </button>
              <button onClick={closeConfirmDialog} style={styles.cancelButton}>
                Không
              </button>
            </div>
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
  confirmOverlay: {
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
  confirmDialog: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    width: "400px",
    textAlign: "center",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
  },
  confirmTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  confirmMessage: {
    fontSize: "14px",
    marginBottom: "20px",
    color: "#555",
  },
  confirmActions: {
    display: "flex",
    justifyContent: "space-around",
  },
  confirmButton: {
    backgroundColor: "#388e3c",
    color: "white",
    padding: "10px 20px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
  },
  popupOverlay: {
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
  popupContainer: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "12px",
    width: "700px",
    maxWidth: "90%",
    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.3)",
    textAlign: "center",
  },
  modalHeader: {
    fontSize: "20px",
    marginBottom: "10px",
    color: "#444",
  },
  modalContent: {
    maxHeight: "400px",
    overflowY: "auto",
  },
  detailTable: {
    width: "100%",
    borderCollapse: "collapse",
    margin: "10px 0",
  },
  detailLabel: {
    fontWeight: "bold",
    padding: "5px 10px",
    textAlign: "left",
    color: "#555",
  },
  detailValue: {
    padding: "5px 10px",
    textAlign: "left",
    color: "#333",
  },
  imageContainer: {
    textAlign: "center",
    padding: "10px",
  },
  modalImage: {
    width: "100px",
    height: "100px",
    objectFit: "cover",
    borderRadius: "5px",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.2)",
  },
  closeButton: {
    marginTop: "15px",
    padding: "10px 15px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  
};

export default ProductManagement;
