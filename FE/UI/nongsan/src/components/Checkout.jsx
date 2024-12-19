import React, { useState, useEffect } from "react";
import CartService from "../services/CartService";
import axios from "axios"; // Import axios
import { useNavigate, useLocation } from "react-router-dom";

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token"); // Retrieve token from localStorage
  const navigate = useNavigate(); // Initialize navigate
  const location = useLocation(); // To access the current URL
  const [transferContent, setTransferContent] = useState("");

  useEffect(() => {
    if (token) {
      // Fetch cart items when the token is available
      CartService.getCartItems(token)
        .then((data) => {
          setCartItems(data);

          // Calculate the total only for the selected items
          const calculatedTotal = data
            .filter((item) => selectedItems.includes(item.idCart)) // Only include selected items
            .reduce((sum, item) => sum + item.price * item.quantity, 0); // Sum the total for selected items

          setTotal(calculatedTotal);
        })
        .catch((error) => {
          console.error("Error fetching cart items:", error);
          setError("Không thể tải giỏ hàng.");
        });
    } else {
      setError("Không tìm thấy token trong localStorage.");
    }
  }, [token, selectedItems]); // Recalculate total when selected items change

  // Handle selection of cart items
  const handleCheckboxChange = (idCart) => {
    setSelectedItems((prevSelectedItems) =>
      prevSelectedItems.includes(idCart)
        ? prevSelectedItems.filter((item) => item !== idCart)
        : [...prevSelectedItems, idCart]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setError("Bạn cần đăng nhập để thực hiện thanh toán!");
      return;
    }

    if (selectedItems.length === 0) {
      setError("Vui lòng chọn ít nhất một sản phẩm để thanh toán.");
      return;
    }

    if (!transferContent.trim()) {
      setError("Vui lòng nhập nội dung chuyển khoản.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("transferContent", transferContent.trim());
    selectedItems.forEach((idCart) => {
      formData.append("idCart", idCart);
    });

    try {
      const response = await axios.post(
        "http://localhost:8080/checkout",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        window.open(response.data, "_blank");
        navigate("/orderhistory");
      } else {
        setError("Không nhận được URL thanh toán.");
      }
    } catch (error) {
      console.error("Error submitting order:", error);
      if (error.response) {
        console.error("Error details:", error.response.data);
      }
      setError("Đã xảy ra lỗi trong quá trình thanh toán.");
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate 1% fee
  const fee = total * 0.01;
  const totalWithFee = total + fee;

  // Styles for the UI
  const styles = {
    container: {
      maxWidth: "900px",
      margin: "2rem auto",
      padding: "2rem",
      backgroundColor: "#fff",
      borderRadius: "8px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    },
    header: {
      color: "#4CAF50",
      fontSize: "2rem",
      fontWeight: "bold",
      marginBottom: "1.5rem",
      textAlign: "center",
    },
    formGroup: {
      marginBottom: "1rem",
    },
    label: {
      display: "block",
      fontWeight: "bold",
      marginBottom: "0.5rem",
      color: "#333",
    },
    input: {
      width: "100%",
      padding: "0.75rem",
      border: "1px solid #ddd",
      borderRadius: "6px",
      marginBottom: "1rem",
      fontSize: "1rem",
    },
    textarea: {
      width: "100%",
      padding: "0.75rem",
      border: "1px solid #ddd",
      borderRadius: "6px",
      marginBottom: "1rem",
      fontSize: "1rem",
    },
    orderSummary: {
      marginBottom: "1rem",
      paddingBottom: "0.5rem",
      borderBottom: "1px solid #e0e0e0",
      fontWeight: "bold",
      display: "flex",
      justifyContent: "space-between",
      color: "#4CAF50",
      fontSize: "1.2rem",
    },
    orderItem: {
      display: "flex",
      justifyContent: "space-between",
      padding: "0.75rem 0",
      borderBottom: "1px solid #f0f0f0",
    },
    orderTotal: {
      fontWeight: "bold",
      display: "flex",
      justifyContent: "space-between",
      padding: "1rem 0",
      fontSize: "1.2rem",
      color: "#d35400",
    },
    button: {
      backgroundColor: "#4CAF50",
      color: "#fff",
      border: "none",
      padding: "1rem 2rem",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "1.1rem",
      width: "100%",
      marginTop: "1rem",
      transition: "background-color 0.3s",
    },
    buttonHover: {
      backgroundColor: "#45a049",
    },
    error: {
      color: "red",
      marginTop: "1rem",
      textAlign: "center",
      fontWeight: "bold",
    },
    loading: {
      color: "blue",
      textAlign: "center",
      marginTop: "1rem",
    },
    checkbox: {
      marginRight: "1rem",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.section}>
        <h2 style={styles.header}>Thông Tin Đơn Hàng</h2>
        {error && <div style={styles.error}>{error}</div>}
        {isLoading && (
          <div style={styles.loading}>
            Đang xử lý thanh toán, vui lòng đợi...
          </div>
        )}
        <div style={styles.orderSummary}>
          <span>SẢN PHẨM</span>
          <span>TẠM TÍNH</span>
        </div>
        {cartItems.map((item) => (
          <div style={styles.orderItem} key={item.idCart}>
            <input
              type="checkbox"
              checked={selectedItems.includes(item.idCart)}
              onChange={() => handleCheckboxChange(item.idCart)}
            />
            <div style={{ flex: "1", marginLeft: "0.5rem" }}>
              <p>{item.nameProduct}</p>
              <p>
                Số lượng: {item.quantity} | Giá:{" "}
                {(item.price * item.quantity).toLocaleString()} đ
              </p>
            </div>
          </div>
        ))}
        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="transferContent">
            <span style={{ display: "flex", alignItems: "center" }}>
              <i
                className="fas fa-edit"
                style={{
                  marginRight: "0.5rem",
                  color: "#4CAF50",
                  fontSize: "1.2rem",
                }}
              ></i>
              Ghi chú đơn hàng
            </span>
          </label>
          <input
            type="text"
            id="transferContent"
            name="transferContent"
            style={{
              ...styles.input,
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              borderColor: "#4CAF50",
            }}
            value={transferContent}
            onChange={(e) => setTransferContent(e.target.value)}
            placeholder="VD: Thanh toán đơn hàng #12345"
          />
          <small style={{ color: "#888", fontStyle: "italic" }}>
            * Vui lòng nhập chính xác nội dung chuyển khoản để xác nhận đơn
            hàng.
          </small>
        </div>

        <div style={styles.orderItem}>
          <span>TẠM TÍNH</span>
          <span>{total.toLocaleString()} đ</span>
        </div>
        <div style={styles.orderItem}>
          <span>Phí 1%</span>
          <span>{fee.toLocaleString()} đ</span>
        </div>
        <div style={styles.orderTotal}>
          <span>TỔNG CỘNG</span>
          <span>{totalWithFee.toLocaleString()} đ</span>
        </div>
        <button type="submit" style={styles.button} onClick={handleSubmit}>
          ĐẶT HÀNG
        </button>
        <button
          type="submit"
          style={styles.button}
          onClick={() => navigate("/productlist")}
        >
          QUAY LẠI MUA
        </button>
      </div>
    </div>
  );
};

export default Checkout;
