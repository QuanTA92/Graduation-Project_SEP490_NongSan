import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CartProduct = () => {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([
    { id: 1, name: "Bơ Hữu Cơ", price: 95000, quantity: 1, image: "https://organic-food.monamedia.net/wp-content/uploads/2023/03/p-08-410x410.jpg" },
    { id: 2, name: "Cà Rốt Hữu Cơ", price: 560000, quantity: 1, image: "https://th.bing.com/th/id/OIP.ldCReM2VqpmFJoNgbyVJ6wHaHa?w=626&h=626&rs=1&pid=ImgDetMain" },
  ]);

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const updateQuantity = (id, delta) => {
    setCartItems(cartItems.map(item => {
      if (item.id === id && item.quantity + delta > 0) {
        return { ...item, quantity: item.quantity + delta };
      }
      return item;
    }));
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  return (
    <div style={styles.cartPageContainer}>
      <div style={styles.cartContent}>
        <h2 style={styles.title}>GIỎ HÀNG</h2>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>HÌNH ẢNH</th>
              <th>SẢN PHẨM</th>
              <th>GIÁ</th>
              <th>SỐ LƯỢNG</th>
              <th>TỔNG</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr key={item.id}>
                <td><img src={item.image} alt={item.name} style={styles.itemImage} /></td>
                <td>{item.name}</td>
                <td>{item.price.toLocaleString()} đ</td>
                <td>
                  <div style={styles.quantityControls}>
                    <button style={styles.quantityButton} onClick={() => updateQuantity(item.id, -1)} disabled={item.quantity <= 1}>-</button>
                    <input type="text" value={item.quantity} readOnly style={styles.quantityInput} />
                    <button style={styles.quantityButton} onClick={() => updateQuantity(item.id, 1)}>+</button>
                  </div>
                </td>
                <td>{(item.price * item.quantity).toLocaleString()} đ</td>
                <td><button onClick={() => removeItem(item.id)} style={styles.removeButton}>×</button></td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={styles.cartSummary}>
          <h3 style={styles.summaryTitle}>TỔNG GIỎ HÀNG</h3>
          <p style={styles.summaryText}><strong>TẠM TÍNH:</strong> {totalPrice.toLocaleString()} đ</p>
          <p style={styles.summaryText}><strong>TỔNG:</strong> {totalPrice.toLocaleString()} đ</p>
          <button style={styles.checkoutButton} onClick={() => navigate("/checkout")}>TIẾN HÀNH THANH TOÁN</button>
        </div>
      </div>
    </div>
  );
};

// CSS trong JavaScript
const styles = {
  cartPageContainer: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '60vh',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    
  },
  cartContent: {
    flex: 1,
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px',
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#2e5b2e', // Xanh lá cây đậm
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '20px',
    textAlign: 'left',
  },
  itemImage: {
    width: '100px',
    height: '100px',
    objectFit: 'cover',
  },
  quantityControls: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButton: {
    width: '30px',
    height: '30px',
    fontSize: '18px',
    backgroundColor: '#c1e1c1', // Màu nền nhẹ cho nút
    border: '1px solid #a3d6a3',
    cursor: 'pointer',
  },
  quantityInput: {
    width: '40px',
    textAlign: 'center',
    margin: '0 10px',
    border: '1px solid #a3d6a3',
    borderRadius: '4px',
    padding: '5px',
    height: '30px',
    lineHeight: '30px',
    backgroundColor: '#ffffff', // Nền trắng cho input
  },
  removeButton: {
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer',
    color: '#ff4d4f', // Màu đỏ cho nút xóa
  },
  cartSummary: {
    float: 'right',
    width: '30%',
    padding: '20px',
    border: '1px solid #a3d6a3', // Biên màu xanh nhạt
    borderRadius: '8px',
    backgroundColor: '#e8f5e9', // Màu nền nhẹ cho tóm tắt giỏ hàng
  },
  summaryTitle: {
    fontSize: '18px',
    marginBottom: '10px',
    fontWeight: 'bold',
    color: '#2e5b2e',
  },
  summaryText: {
    margin: '10px 0',
    fontSize: '16px',
  },
  checkoutButton: {
    width: '100%',
    padding: '15px',
    backgroundColor: '#4caf50', // Màu xanh lá cho nút thanh toán
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    textAlign: 'center',
  },
};

export default CartProduct;