import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductService from "../services/ProductService"; // Assuming ProductService can fetch data from your API
import Filters from "./Filters";

const SupplierProducts = () => {
  const { idHouseHold } = useParams();
  const navigate = useNavigate(); // Hook to navigate to the product details page
  const [products, setProducts] = useState([]);
  const [supplier, setSupplier] = useState(null); // State for supplier info
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 3;

  useEffect(() => {
    // Fetch supplier and product data by household ID
    ProductService.getProductByHouseHold(idHouseHold)
      .then((response) => {
        setProducts(response.data.productResponses);
        setSupplier({
          fullName: response.data.fullName,
          phone: response.data.phone,
          email: response.data.email,
          totalProducts: response.data.totalProducts,
        });
        setLoading(false);
      })
      .catch((error) => {
        setError("Không thể tải sản phẩm.");
        setLoading(false);
      });
  }, [idHouseHold]);

  if (loading)
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>Loading...</div>
    );
  if (error)
    return (
      <div style={{ textAlign: "center", padding: "20px", color: "red" }}>
        {error}
      </div>
    );

  // Calculate the current products to display
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  // Handle Product Click
  const handleProductClick = (productId) => {
    // Navigate to product detail page with the product ID
    navigate(`/product/${productId}`);
  };

  // Pagination: Change Page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Total Pages
  const totalPages = Math.ceil(products.length / productsPerPage);

  return (
    <>
    <Filters />
      <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Supplier Information Section */}
      {supplier && (
        <div
          style={{
            backgroundColor: "#fff",
            padding: "30px",
            marginBottom: "40px",
            borderRadius: "10px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            textAlign: "center",
            borderTop: "6px solid #4CAF50", // Accent color at the top
          }}
        >
          <h1
            style={{
              fontSize: "2.2rem",
              marginBottom: "15px",
              color: "#333",
              fontWeight: "bold",
            }}
          >
            Nhà cung cấp:{" "}
            <span style={{ color: "#4CAF50" }}>{supplier.fullName}</span>
          </h1>
          <p
            style={{ fontSize: "1.1rem", color: "#555", marginBottom: "10px" }}
          >
            <strong>Số điện thoại:</strong> {supplier.phone}
          </p>
          <p
            style={{ fontSize: "1.1rem", color: "#555", marginBottom: "10px" }}
          >
            <strong>Email:</strong> {supplier.email}
          </p>
          <p style={{ fontSize: "1rem", color: "#444" }}>
            <strong>Tổng sản phẩm:</strong>{" "}
            <span style={{ fontWeight: "bold" }}>{supplier.totalProducts}</span>
          </p>
        </div>
      )}

      <h2
        style={{
          textAlign: "center",
          marginBottom: "20px",
          fontSize: "1.8rem",
        }}
      >
        Sản phẩm của nhà cung cấp
      </h2>

      {/* Product List Section */}
      {currentProducts.length > 0 ? (
        <div
          className="product-list"
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-around",
            gap: "20px",
          }}
        >
          {currentProducts.map((product) => (
            <div
              key={product.idProduct}
              style={{
                backgroundColor: "#fff",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                padding: "15px",
                width: "280px",
                textAlign: "center",
                transition: "transform 0.3s ease",
                cursor: "pointer",
              }}
              onClick={() => handleProductClick(product.idProduct)} // Handle product click
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              <img
                src={product.imageProducts[0]}
                alt={product.nameProduct}
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  marginBottom: "10px",
                  transition: "transform 0.3s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.05)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              />
              <h3
                style={{
                  fontSize: "1.2rem",
                  marginBottom: "10px",
                  color: "#333",
                }}
              >
                {product.nameProduct}
              </h3>
              <p style={{ fontSize: "1rem", color: "#888" }}>
                {product.descriptionProduct || "Chưa có mô tả"}
              </p>
              <p
                style={{ fontSize: "1rem", fontWeight: "bold", color: "#333" }}
              >
                {Number(product.priceProduct).toLocaleString("vi-VN")}đ
              </p>

              <p style={{ fontSize: "0.9rem", color: "#888" }}>
                Số lượng: {product.quantityProduct} | Trạng thái:{" "}
                {product.statusProduct}
              </p>
              <p style={{ fontSize: "0.9rem", color: "#444" }}>
                Hết hạn: {new Date(product.expirationDate).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ textAlign: "center", fontSize: "1.2rem" }}>
          Không có sản phẩm nào.
        </p>
      )}

      {/* Pagination */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          style={{
            marginRight: "10px",
            padding: "10px 15px",
            fontSize: "1rem",
            cursor: currentPage === 1 ? "not-allowed" : "pointer",
            backgroundColor: currentPage === 1 ? "#ddd" : "#4CAF50",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Trước
        </button>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{
            padding: "10px 15px",
            fontSize: "1rem",
            cursor: currentPage === totalPages ? "not-allowed" : "pointer",
            backgroundColor: currentPage === totalPages ? "#ddd" : "#4CAF50",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Tiếp
        </button>
      </div>
    </div>
    </>
  );
};

export default SupplierProducts;
