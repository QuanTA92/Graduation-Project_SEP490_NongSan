import React, { useState, useEffect } from "react";
import axios from "axios";

const WalletAllHouseHold = () => {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const apiBase = "http://localhost:8080/api/wallet";
  const token = localStorage.getItem("token");

  const axiosInstance = axios.create({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Fetch all wallets (households)
  const fetchWallets = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`${apiBase}/get`);
      setWallets(response.data);
    } catch (error) {
      console.error("Error fetching wallets:", error);
    }
    setLoading(false);
  };

  // Pagination handlers
  const totalPages = Math.ceil(wallets.length / itemsPerPage);
  const currentItems = wallets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  useEffect(() => {
    fetchWallets();
  }, []);

  return (
    <div style={styles.container}>
      <h1 className="text-2xl font-bold mb-4 text-center">Thông Tin Tài Khoản Gia Đình</h1>

      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <div>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={{ ...styles.thTd, ...styles.th }}>ID Người Dùng</th>
                <th style={{ ...styles.thTd, ...styles.th }}>Tên Hộ Gia Đình</th>
                <th style={{ ...styles.thTd, ...styles.th }}>Số Tài Khoản Ngân Hàng</th>
                <th style={{ ...styles.thTd, ...styles.th }}>Ngân Hàng</th>
                <th style={{ ...styles.thTd, ...styles.th }}>Vị Trí Đăng Ký</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((wallet) => (
                <tr key={wallet.idUser}>
                  <td style={styles.thTd}>{wallet.idUser}</td>
                  <td style={styles.thTd}>{wallet.nameHouseHold}</td>
                  <td style={styles.thTd}>{wallet.bankAccountNumber}</td>
                  <td style={styles.thTd}>{wallet.bankName}</td>
                  <td style={styles.thTd}>{wallet.registrationLocation}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={styles.pagination}>
            <button
              style={{ ...styles.button, ...styles.btnPage }}
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              Trước
            </button>
            <span>
              Trang {currentPage} / {totalPages}
            </span>
            <button
              style={{ ...styles.button, ...styles.btnPage }}
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Tiếp
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding: "20px", fontFamily: "Arial, sans-serif", backgroundColor: "#f9f9f9", paddingTop: '5rem' },
  table: { width: "100%", borderCollapse: "collapse", marginTop: "20px" },
  thTd: { padding: "10px", textAlign: "center", border: "1px solid #ddd" },
  th: { backgroundColor: "#6cbb3c", color: "white" },
  button: { padding: "10px 20px", margin: "5px", border: "none", cursor: "pointer", borderRadius: "5px", fontWeight: "bold" },
  btnPage: { backgroundColor: "#6cbb3c", color: "white" },
  pagination: { display: "flex", justifyContent: "center", marginTop: "20px", alignItems: "center", gap: "10px" },
};

export default WalletAllHouseHold;
