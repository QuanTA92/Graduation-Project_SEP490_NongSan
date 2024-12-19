import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CartService from "../services/CartService"; // Import CartService
import { useAuth } from "../AuthContext"; // Để lấy token từ AuthContext
import { useCart } from "../CartProvider"; // Import useCart
import Filters from "../components/Filters";
import { toast, ToastContainer } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; 
const CartProduct = () => {
  const navigate = useNavigate();
  const { token } = useAuth(); // Lấy token từ AuthContext
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setCartCount } = useCart(); // Lấy hàm cập nhật cartCount

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const items = await CartService.getCartItems(token);
        setCartItems(items); // Cập nhật danh sách sản phẩm
      } catch (error) {
        console.error("Error fetching cart items:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchCartItems();
    }
  }, [token]);

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const updateQuantity = async (idCart, delta) => {
    const item = cartItems.find((item) => item.idCart === idCart);
    const newQuantity = item.quantity + delta;

    if (newQuantity <= 0) return;

    try {
      const updatedItem = { ...item, quantity: newQuantity };
      await CartService.updateCartItem(idCart, updatedItem, token);
      const updatedCart = cartItems.map((item) =>
        item.idCart === idCart ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updatedCart);

      const totalQuantity = updatedCart.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      setCartCount(totalQuantity);

      toast.success("Cập nhật số lượng sản phẩm thành công!");
    } catch (error) {
      console.error("Error updating cart item:", error);
      toast.error("Không thể cập nhật số lượng sản phẩm");
    }
  };

  const removeItem = async (idCart) => {
    try {
      await CartService.deleteCartItem(idCart, token);
      const updatedCart = cartItems.filter((item) => item.idCart !== idCart);
      setCartItems(updatedCart);

      const totalQuantity = updatedCart.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      setCartCount(totalQuantity);

      toast.success("Đã xóa sản phẩm khỏi giỏ hàng.");
    } catch (error) {
      console.error("Error deleting cart item:", error);
      toast.error("Không thể xóa sản phẩm khỏi giỏ hàng");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Filters />
      <div style={styles.cartPageContainer}>
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
        <div style={styles.cartContent}>
          <h2 style={styles.title}>GIỎ HÀNG</h2>

          {/* Kiểm tra nếu giỏ hàng trống */}
          {cartItems.length === 0 ? (
            <p style={styles.noItemsText}>Chưa có sản phẩm nào trong giỏ hàng.</p>
          ) : (
            <>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.tableHeader}>HÌNH ẢNH</th>
                    <th style={styles.tableHeader}>SẢN PHẨM</th>
                    <th style={styles.tableHeader}>GIÁ</th>
                    <th style={styles.tableHeader}>SỐ LƯỢNG</th>
                    <th style={styles.tableHeader}>TỔNG</th>
                    <th style={styles.tableHeader}></th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.idCart} style={styles.tableRow}>
                      <td style={styles.tableCell}>
                        <img
                          src={item.firstImage}
                          alt={item.nameProduct}
                          style={styles.itemImage}
                        />
                      </td>
                      <td style={styles.tableCell}>{item.nameProduct}</td>
                      <td style={styles.tableCell}>
                        {item.price.toLocaleString()} đ
                      </td>
                      <td style={styles.tableCell}>
                        <div style={styles.quantityControls}>
                          <button
                            style={styles.quantityButton}
                            onClick={() => updateQuantity(item.idCart, -1)}
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <input
                            type="text"
                            value={item.quantity}
                            style={styles.quantityInput}
                            onChange={(e) => {
                              const value = e.target.value.replace(/[^0-9]/g, ""); // Chỉ cho phép số
                              const newQuantity = parseInt(value, 10) || 1; // Giá trị tối thiểu là 1
                              setCartItems((prevCartItems) =>
                                prevCartItems.map((cartItem) =>
                                  cartItem.idCart === item.idCart
                                    ? { ...cartItem, quantity: newQuantity }
                                    : cartItem
                                )
                              );
                            }}
                            onBlur={() =>
                              updateQuantity(
                                item.idCart,
                                item.quantity - item.quantity
                              )
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                updateQuantity(
                                  item.idCart,
                                  item.quantity - item.quantity
                                );
                              }
                            }}
                          />
                          <button
                            style={styles.quantityButton}
                            onClick={() => updateQuantity(item.idCart, 1)}
                          >
                            +
                          </button>
                        </div>
                      </td>

                      <td style={styles.tableCell}>
                        {(item.price * item.quantity).toLocaleString()} đ
                      </td>
                      <td style={styles.tableCell}>
                        <button
                          onClick={() => removeItem(item.idCart)}
                          style={styles.removeButton}
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={styles.cartSummary}>
                <h3 style={styles.summaryTitle}>TỔNG GIỎ HÀNG</h3>
                <p style={styles.summaryText}>
                  <strong>TẠM TÍNH:</strong> {totalPrice.toLocaleString()} đ
                </p>
                <p style={styles.summaryText}>
                  <strong>TỔNG:</strong> {totalPrice.toLocaleString()} đ
                </p>
                <button
                  style={styles.checkoutButton}
                  onClick={() => navigate("/checkout")}
                >
                  TIẾN HÀNH THANH TOÁN
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

const styles = {
  cartPageContainer: {
    display: "flex",
    flexDirection: "column",
    minHeight: "60vh",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  cartContent: {
    flex: 1,
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "24px",
    fontWeight: "bold",
    color: "#2e5b2e",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: "20px",
    textAlign: "center",
  },
  tableHeader: {
    fontWeight: "bold",
    padding: "10px",
    backgroundColor: "#f4f4f4",
    borderBottom: "1px solid #ddd",
  },
  tableRow: {
    borderBottom: "1px solid #ddd",
  },
  tableCell: {
    padding: "10px",
    verticalAlign: "middle",
  },
  itemImage: {
    width: "100px",
    height: "100px",
    objectFit: "cover",
  },
  quantityControls: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  quantityButton: {
    width: "30px",
    height: "30px",
    fontSize: "18px",
    backgroundColor: "#c1e1c1",
    border: "1px solid #a3d6a3",
    cursor: "pointer",
  },
  quantityInput: {
    width: "40px",
    textAlign: "center",
    margin: "0 10px",
    border: "1px solid #a3d6a3",
    borderRadius: "4px",
    padding: "5px",
    backgroundColor: "#fff",
  },
  removeButton: {
    backgroundColor: "transparent",
    border: "none",
    fontSize: "18px",
    cursor: "pointer",
    color: "#ff4d4f",
  },
  cartSummary: {
    float: "right",
    width: "30%",
    padding: "20px",
    border: "1px solid #a3d6a3",
    borderRadius: "8px",
    backgroundColor: "#e8f5e9",
  },
  summaryTitle: {
    fontSize: "18px",
    marginBottom: "10px",
    fontWeight: "bold",
    color: "#2e5b2e",
  },
  summaryText: {
    margin: "10px 0",
    fontSize: "16px",
  },
  checkoutButton: {
    width: "100%",
    padding: "15px",
    backgroundColor: "#4caf50",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    textAlign: "center",
  },
  message: {
    backgroundColor: "#dff0d8",
    color: "#3c763d",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "5px",
    textAlign: "center",
    fontSize: "14px",
    fontWeight: "bold",
    border: "1px solid #d6e9c6",
  },
  noItemsText: {
    textAlign: "center",
    fontSize: "18px",
    color: "#f44336",
    fontWeight: "bold",
  },
};

export default CartProduct;
