import React, { useState } from "react";
import WalletHouse from "../services/WalletHouse"; // Import WalletHouse
import { useNavigate } from "react-router-dom"; // Import useNavigate để điều hướng
import { toast, ToastContainer } from "react-toastify"; // Import react-toastify
import "react-toastify/dist/ReactToastify.css"; // Import styles for toast notifications

const WalletForm = () => {
  const [formData, setFormData] = useState({
    bankAccountNumber: "",
    bankName: "",
    registrationLocation: "",
  });
  const navigate = useNavigate(); // Khởi tạo navigate để chuyển hướng
  const [responseMessage, setResponseMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false); // Thêm trạng thái isSuccess
  const [walletInfo, setWalletInfo] = useState([]); // State lưu trữ thông tin ví

  // Xử lý thay đổi trong form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Gọi API lấy thông tin ví
  const loadWalletInfo = async () => {
    const token = localStorage.getItem("token"); // Lấy token nếu cần
    try {
      const response = await WalletHouse.getInfoWallet(token);
      console.log(response.data); // Kiểm tra dữ liệu trả về
      setWalletInfo(response.data); // Cập nhật thông tin ví
    } catch (error) {
      setResponseMessage("Không thể lấy thông tin ví.");
      console.error(error); // Log lỗi để dễ dàng debug
    }
  };

  // Gửi dữ liệu tới API sử dụng addWallet từ WalletHouse
  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn form submit mặc định
    const token = localStorage.getItem("token"); // Lấy token nếu cần

    try {
      // Gọi API thêm ví bằng WalletHouse
      await WalletHouse.addWallet(token, formData);

      setResponseMessage("Ví đã được tạo thành công!"); // Thông báo thành công
      setIsSuccess(true); // Cập nhật trạng thái là thành công
      setFormData({
        bankAccountNumber: "",
        bankName: "",
        registrationLocation: "",
      }); // Reset form sau khi thành công

      // Hiển thị thông báo alert thành công
      toast.success("Ví đã được tạo thành công!");

      // Tải lại thông tin ví sau khi tạo ví
      loadWalletInfo();

      // Chuyển hướng người dùng về trang quản lý ví
      navigate("/wallet"); // Điều hướng đến trang quản lý ví
    } catch (error) {
      if (error.response) {
        setResponseMessage(error.response.data); // Hiển thị thông báo lỗi từ server
      } else {
        setResponseMessage("Đã có lỗi xảy ra khi tạo ví.");
      }
      setIsSuccess(false); // Cập nhật trạng thái là lỗi

      // Hiển thị thông báo alert lỗi
      toast.error("Đã có lỗi xảy ra khi tạo ví. Vui lòng thử lại.");
    }
  };

  return (
    <div style={styles.container}>
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
      <h2 style={styles.header}>Ví cá nhân</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>Số tài khoản ngân hàng:</label>
        <input
          type="text"
          name="bankAccountNumber"
          value={formData.bankAccountNumber}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <label style={styles.label}>Tên ngân hàng:</label>
        <input
          type="text"
          name="bankName"
          value={formData.bankName}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <label style={styles.label}>Nơi đăng ký:</label>
        <input
          type="text"
          name="registrationLocation"
          value={formData.registrationLocation}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <button type="submit" style={styles.button}>Tạo ví</button>
      </form>

      {/* Hiển thị thông báo sau khi tạo ví */}
      {responseMessage && (
        <p
          style={isSuccess ? styles.successMessage : styles.message}
        >
          {responseMessage}
        </p>
      )}

      {/* Hiển thị thông tin ví */}
      {walletInfo.length > 0 && (
        <div style={styles.walletInfoContainer}>
          <h3 style={styles.walletInfoHeader}>Thông tin ví</h3>
          {walletInfo.map((wallet, index) => (
            <div key={index} style={styles.walletInfoItem}>
              <p><strong>Số tài khoản:</strong> {wallet.bankAccountNumber}</p>
              <p><strong>Ngân hàng:</strong> {wallet.bankName}</p>
              <p><strong>Nơi đăng ký:</strong> {wallet.registrationLocation}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "30px",
    fontFamily: "Arial, sans-serif",
    maxWidth: "450px",
    margin: "0 auto",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  header: {
    textAlign: "center",
    fontSize: "24px",
    marginBottom: "20px",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  label: {
    fontSize: "16px",
    color: "#555",
  },
  input: {
    padding: "12px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    fontSize: "16px",
    backgroundColor: "#fff",
    transition: "border-color 0.3s ease",
  },
  button: {
    padding: "12px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    transition: "background-color 0.3s ease",
  },
  message: {
    marginTop: "20px",
    fontSize: "14px",
    color: "red",
    textAlign: "center",
  },
  successMessage: {
    marginTop: "20px",
    fontSize: "14px",
    color: "green", // Màu xanh cho thông báo thành công
    textAlign: "center",
  },
  walletInfoContainer: {
    marginTop: "30px",
    padding: "20px",
    backgroundColor: "#f1f1f1",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  walletInfoHeader: {
    fontSize: "20px",
    textAlign: "center",
    marginBottom: "15px",
  },
  walletInfoItem: {
    marginBottom: "15px",
  }
};

export default WalletForm;
