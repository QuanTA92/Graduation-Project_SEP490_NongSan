import React, { useState, useEffect } from "react";
import FarmerProductForm from "./FarmerProductForm";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate instead of useHistory
import ProductService from "../services/ProductService"; // Import the ProductService class

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate(); // useNavigate instead of useHistory

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/product/get");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

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
    const isConfirmed = window.confirm("Are you sure you want to delete this product?");
  
    if (isConfirmed) {
      try {
        // Call deleteProduct from ProductService
        await ProductService.deleteProduct(productId, token);
        // Remove product from state after successful deletion
        setProducts(products.filter((product) => product.idProduct !== productId));
        console.log("Product deleted successfully");
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    } else {
      console.log("Product deletion was canceled.");
    }
  };
  

  const openEditForm = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const openAddForm = () => {
    navigate("/add"); // Redirect to the add product page
  };

  function updateProduct(id) {
    navigate(`/update/${id}`);
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Product Management</h2>
      <button onClick={openAddForm} style={styles.addButton}>
        Add Product
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
          {products.map((product) => (
            <tr key={product.idProduct}>
              <td style={styles.tableCell}>{product.idProduct}</td>
              <td style={styles.tableCell}>{product.nameProduct}</td>
              <td style={styles.tableCell}>{product.priceProduct}</td>
              <td style={styles.tableCell}>{product.quantityProduct}</td>
              <td style={styles.tableCell}>{product.statusProduct}</td>
              <td style={styles.tableCell}>
                <button
                  onClick={() => updateProduct(product.idProduct)}
                  style={styles.editButton}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteProduct(product.idProduct)} // Use handleDeleteProduct
                  style={styles.deleteButton}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
};

export default ProductManagement;
