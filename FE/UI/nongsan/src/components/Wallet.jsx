import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Filters from './Filters';
import { toast, ToastContainer } from "react-toastify"; // Import react-toastify
import "react-toastify/dist/ReactToastify.css"; // Import styles for toast notifications

const Wallet = () => {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [walletData, setWalletData] = useState({
    bankAccountNumber: '',
    bankName: '',
    registrationLocation: '',
  });
  const token = localStorage.getItem("token");

  useEffect(() => {
    checkWallet();
  }, []);

  const checkWallet = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/wallet/checkWallet', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data === 'Wallet has not been created yet.') {
        setWallet(null);
        setLoading(false);
      } else {
        getWalletDetails();
      }
    } catch (error) {
      setError('Lỗi khi kiểm tra ví.');
      setLoading(false);
    }
  };

  const getWalletDetails = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/wallet/getForAccountHouseHold', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.length > 0) {
        setWallet(response.data[0]);
        setWalletData({
          bankAccountNumber: response.data[0].bankAccountNumber,
          bankName: response.data[0].bankName,
          registrationLocation: response.data[0].registrationLocation,
        });
      } else {
        setWallet(null);
      }
      setLoading(false);
    } catch (error) {
      setError('Lỗi khi lấy thông tin ví.');
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        'http://localhost:8080/api/wallet/update',
        walletData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // Translate the success message
      if (response.data === 'Wallet updated successfully.') {
        toast.success('Cập nhật ví thành công.');
      } else {
        toast.error(response.data);
      }
  
      setEditMode(false);
      getWalletDetails();
    } catch (error) {
      setError('Lỗi khi cập nhật ví.');
    }
  };
  

  // const handleDelete = async () => {
  //   try {
  //     const response = await axios.delete('http://localhost:8080/api/wallet/delete', {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     alert(response.data);
  //     setWallet(null);
  //   } catch (error) {
  //     setError('Lỗi khi xóa ví.');
  //   }
  // };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setWalletData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  if (loading) return <div>Đang tải...</div>;

  return (
    <>
    <Filters />
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
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '80vh',  // Make the container take full height
      fontFamily: 'Arial, sans-serif',
      backgroundImage: `url("https://www.jjay.cuny.edu/sites/default/files/2023-09/veg-fruits.jpg")`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative',
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',  // A semi-transparent dark overlay for better readability
        backdropFilter: 'blur(10px)',  // Blur effect for the background
        zIndex: -1,  // Ensure the background is behind the content
      }}></div>

      <div style={{
        padding: '20px',
        maxWidth: '600px',
        width: '100%',
        border: '1px solid #ccc',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        backgroundColor: 'white', // Keep the wallet card background white
        zIndex: 1,
      }}>
        {wallet ? (
          <div>
            <h2 style={{ color: '#4CAF50', textAlign: 'center' }}>Thông tin ví</h2>
            <table style={{
              width: '100%',
              marginBottom: '20px',
              borderCollapse: 'collapse',
            }}>
              <tbody>
                <tr>
                  <th style={{ textAlign: 'left', padding: '8px' }}>Số tài khoản ngân hàng:</th>
                  <td style={{ padding: '8px' }}>{wallet.bankAccountNumber}</td>
                </tr>
                <tr>
                  <th style={{ textAlign: 'left', padding: '8px' }}>Tên ngân hàng:</th>
                  <td style={{ padding: '8px' }}>{wallet.bankName}</td>
                </tr>
                <tr>
                  <th style={{ textAlign: 'left', padding: '8px' }}>Địa chỉ đăng ký:</th>
                  <td style={{ padding: '8px' }}>{wallet.registrationLocation}</td>
                </tr>
              </tbody>
            </table>
            {editMode ? (
              <div>
                <div style={{ marginBottom: '10px' }}>
                  <input
                    type="text"
                    name="bankAccountNumber"
                    value={walletData.bankAccountNumber}
                    onChange={handleInputChange}
                    placeholder="Số tài khoản ngân hàng"
                    style={inputStyle}
                  />
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <input
                    type="text"
                    name="bankName"
                    value={walletData.bankName}
                    onChange={handleInputChange}
                    placeholder="Tên ngân hàng"
                    style={inputStyle}
                  />
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <input
                    type="text"
                    name="registrationLocation"
                    value={walletData.registrationLocation}
                    onChange={handleInputChange}
                    placeholder="Địa chỉ đăng ký"
                    style={inputStyle}
                  />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <button onClick={handleUpdate} style={buttonStyle}>Lưu thay đổi</button>
                  <button onClick={() => setEditMode(false)} style={cancelButtonStyle}>Hủy</button>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <button onClick={() => setEditMode(true)} style={buttonStyle}>Chỉnh sửa</button>
              </div>
            )}
          </div>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#f44336' }}>Chưa có ví cho tài khoản của bạn. Vui lòng tạo ví mới.</p>
          </div>
        )}
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      </div>
    </div>
    </>
  );
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  margin: '5px 0',
  border: '1px solid #ccc',
  borderRadius: '4px',
};

const buttonStyle = {
  backgroundColor: '#4CAF50',
  color: 'white',
  padding: '10px 20px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  marginRight: '10px',
};

const cancelButtonStyle = {
  backgroundColor: '#f44336',
  color: 'white',
  padding: '10px 20px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

const deleteButtonStyle = {
  backgroundColor: '#f44336',
  color: 'white',
  padding: '10px 20px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

export default Wallet;
