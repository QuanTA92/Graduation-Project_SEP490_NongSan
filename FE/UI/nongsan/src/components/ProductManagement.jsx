import React, { useState, useEffect } from 'react';
import FarmerProductForm from './FarmerProductForm';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const initialProducts = [
      { id: 1, productName: 'Cà chua', image: "", price: 15000, quantity: 100, status: 'Còn hàng' },
      { id: 2, productName: 'Dưa leo', image: "", price: 12000, quantity: 80, status: 'Hết hàng' },
    ];
    setProducts(initialProducts);
  }, []);

  const handleAddProduct = (newProduct) => {
    setProducts([...products, { id: products.length + 1, ...newProduct }]);
    setShowForm(false);
  };

  const handleEditProduct = (updatedProduct) => {
    setProducts(
      products.map((product) => (product.id === updatedProduct.id ? updatedProduct : product))
    );
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleDeleteProduct = (productId) => {
    setProducts(products.filter((product) => product.id !== productId));
  };

  const openEditForm = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const openAddForm = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Product Management</h2>
      <button onClick={openAddForm} style={styles.addButton}>Add Product</button>
      
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.tableCell}>ID</th>
            <th style={styles.tableCell}>Product Name</th>
            <th style={styles.tableCell}>Price (VND)</th>
            <th style={styles.tableCell}>Quantity</th>
            <th style={styles.tableCell}>Status</th>
            <th style={styles.tableCell}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} style={styles.row}>
              <td style={styles.tableCell}>{product.id}</td>
              <td style={styles.tableCell}>{product.productName}</td>
              <td style={styles.tableCell}>{product.price}</td>
              <td style={styles.tableCell}>{product.quantity}</td>
              <td style={styles.tableCell}>{product.status}</td>
              <td style={styles.tableCell}>
                <button onClick={() => openEditForm(product)} style={styles.editButton}>Edit</button>
                <button onClick={() => handleDeleteProduct(product.id)} style={styles.deleteButton}>Delete</button>
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
            <button onClick={() => setShowForm(false)} style={styles.cancelButton}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px 40px',
    fontFamily: 'Arial, sans-serif',
    // backgroundColor: '#f4f4f9',
    minHeight: '55vh',
  },
  header: {
    fontSize: '24px',
    color: '#333',
    marginBottom: '20px',
  },
  addButton: {
    padding: '10px 15px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginBottom: '20px',
    transition: 'background-color 0.3s',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: 'white',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  tableCell: {
    padding: '10px',
    textAlign: 'center',
    borderBottom: '1px solid #ddd',
    width: '16.6%',  // Chia đều mỗi cột trong bảng
  },
  row: {
    transition: 'background-color 0.3s',
  },
  editButton: {
    backgroundColor: '#FFC107',
    color: 'white',
    border: 'none',
    padding: '5px 10px',
    marginRight: '5px',
    cursor: 'pointer',
    borderRadius: '4px',
    transition: 'background-color 0.3s',
  },
  deleteButton: {
    backgroundColor: '#F44336',
    color: 'white',
    border: 'none',
    padding: '5px 10px',
    cursor: 'pointer',
    borderRadius: '4px',
    transition: 'background-color 0.3s',
  },
  formOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  formContainer: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    width: '600px',
    maxWidth: '100%',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
  },
  cancelButton: {
    padding: '10px 15px',
    backgroundColor: '#CCCCCC',
    color: '#333',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px',
    transition: 'background-color 0.3s',
  },
};

export default ProductManagement;
