import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import ProductService from "../services/ProductService";
import CartService from "../services/CartService"; // Import CartService
import { useAuth } from "../AuthContext"; // Để lấy token từ AuthContext
import { useCart } from "../CartProvider";
import { toast, ToastContainer } from "react-toastify"; // Import react-toastify
import "react-toastify/dist/ReactToastify.css"; // Import styles for toast notifications

const DetailProduct = () => {
  const [quantity, setQuantity] = useState(1);
  const { idProduct } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate(); // Initialize navigate
  const { cartCount, setCartCount } = useCart();
  const [isExpanded, setIsExpanded] = useState(false);
  // const [notification, setNotification] = useState(null); // Thêm state cho thông báo

  // Handle toggle expansion
  const toggleDescription = () => setIsExpanded(!isExpanded);

  // Get user token (adjust based on your authentication method)
  const { token } = useAuth(); // Lấy token từ AuthContext
  // useEffect(() => {
  //   if (notification) {
  //     const timer = setTimeout(() => {
  //       setNotification(null); // Xóa thông báo sau 3 giây
  //     }, 3000);

  //     return () => clearTimeout(timer); // Xóa timer nếu component unmount
  //   }
  // }, [notification]);
  useEffect(() => {
    ProductService.getProductById(idProduct)
      .then((response) => {
        setProduct(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Không thể tải thông tin sản phẩm.");
        setLoading(false);
      });
  }, [idProduct]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!product) return <p>Sản phẩm không tồn tại.</p>;

  const {
    nameProduct,
    priceProduct,
    descriptionProduct,
    imageProducts,
    statusProduct,
    expirationDate,
    nameSubcategory,
    qualityCheck,
    nameHouseHold,
    quantityProduct,
    createDate,
    cityProduct,
    districtProduct,
    wardProduct,
    specificAddressProduct,
  } = product;

  // Utility function to format dates
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };

  // Hàm để thêm sản phẩm vào giỏ hàng
  const handleAddToCart = async (productId) => {
    if (!token) {
      toast.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.");
      return;
    }

    // Check if the selected quantity is greater than the available quantity
    if (quantity > quantityProduct) {
      toast.warning(`Sản phẩm chỉ còn ${quantityProduct} sản phẩm trong kho.`);
      return;
    }

    const cartItem = {
      idProduct: productId,
      quantity: quantity, // Use the current quantity from the state
    };

    try {
      // Send request to add the product to the cart
      await CartService.addItemToCart(cartItem, token);
      toast.success("Sản phẩm đã được thêm vào giỏ hàng.");
      // Update cart count directly without needing to call the API
      setCartCount(cartCount + quantity); // Increase the cart count by the selected quantity
    } catch (error) {
      console.error("Có lỗi xảy ra khi thêm vào giỏ hàng:", error);
      toast.error("Có lỗi xảy ra khi thêm vào giỏ hàng. Vui lòng thử lại.");
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageProducts.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prevIndex) =>
        (prevIndex - 1 + imageProducts.length) % imageProducts.length
    );
  };

  // Hàm để tăng số lượng sản phẩm
  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };

  // Hàm để giảm số lượng sản phẩm
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div style={styles.card}>
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
    <button
      style={styles.backButton}
      onClick={() => navigate(-1)}
      onMouseEnter={(e) =>
        (e.target.style.backgroundColor =
          styles.backButtonHover.backgroundColor)
      }
      onMouseLeave={(e) =>
        (e.target.style.backgroundColor =
          styles.backButton.backgroundColor)
      }
    >
      Quay lại
    </button>
    <div style={styles.mainContent}>
      {/* Column 1: Product Image */}
      <div style={styles.leftColumn}>
        <div style={styles.imageContainer}>
          {imageProducts && imageProducts.length > 0 && (
            <>
              <img
                src={imageProducts[currentImageIndex]}
                alt={`Image of ${nameProduct}`}
                style={styles.image}
              />
              <span
                style={{ ...styles.arrowButton, ...styles.leftArrow }}
                onClick={prevImage}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor =
                    styles.arrowButtonHover.backgroundColor)
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor =
                    styles.arrowButton.backgroundColor)
                }
              >
                &#8592;
              </span>
              <span
                style={{ ...styles.arrowButton, ...styles.rightArrow }}
                onClick={nextImage}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor =
                    styles.arrowButtonHover.backgroundColor)
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor =
                    styles.arrowButton.backgroundColor)
                }
              >
                &#8594;
              </span>
            </>
          )}
        </div>
      </div>

      {/* Column 2: Product Info */}
      <div style={styles.middleColumn}>
        <h1 style={styles.title}>{nameProduct}</h1>
        
        <p style={styles.price}>
          {Number(priceProduct).toLocaleString()}đ/kg
        </p>
        <p style={styles.description}>
          {isExpanded
            ? descriptionProduct
            : descriptionProduct.slice(0, 100) + "..."}
        </p>
        <button onClick={toggleDescription}>
          {isExpanded ? "Thu gọn" : "Đọc thêm"}
        </button>
        <div style={styles.quantitySelector}>
          <button style={styles.quantityButton} onClick={decrementQuantity}>
            -
          </button>
          <input
            style={styles.quantityInput}
            type="number"
            value={quantity}
            onChange={(e) => {
              const newQuantity = Math.max(1, parseInt(e.target.value, 10));
              setQuantity(newQuantity);
            }}
          />
          <button style={styles.quantityButton} onClick={incrementQuantity}>
            +
          </button>
        </div>
        <button
          style={styles.addToCartButton}
          onClick={() => handleAddToCart(product.idProduct)}
        >
          Thêm vào giỏ hàng
        </button>
      </div>

      {/* Column 3: Product Details */}
      <div style={styles.rightColumn}>
        <div style={styles.productInfo}>
          <div style={styles.infoGrid}>
            <div style={styles.infoItem}>
              <strong style={styles.infoLabel}>Danh mục:</strong>
              <span>{nameSubcategory}</span>
            </div>
            {quantityProduct > 0 && (
              <div style={styles.infoItem}>
                <strong style={styles.infoLabel}>Số lượng:</strong>
                <span>{quantityProduct}</span>
              </div>
            )}
            <div style={styles.infoItem}>
              <strong style={styles.infoLabel}>Chất lượng:</strong>
              <span>{qualityCheck}</span>
            </div>
            <div style={styles.infoItem}>
              <strong style={styles.infoLabel}>Hạn sử dụng:</strong>
              <span>{formatDate(expirationDate)}</span>
            </div>
            <div style={styles.infoItem}>
              <strong style={styles.infoLabel}>Tình trạng:</strong>
              <span>{statusProduct}</span>
            </div>
            <div style={styles.infoItem}>
              <strong style={styles.infoLabel}>Nhà cung cấp:</strong>
              <span
                style={styles.link}
                onClick={() =>
                  navigate(`/household/${product.idHouseHold}`)
                }
              >
                {nameHouseHold}
              </span>
            </div>
            <div style={styles.infoItem}>
              <strong style={styles.infoLabel}>Địa chỉ:</strong>
              <span>{`${specificAddressProduct}, ${wardProduct}, ${districtProduct}, ${cityProduct}`}</span>
            </div>
            <div style={styles.infoItem}>
              <strong style={styles.infoLabel}>Ngày tạo:</strong>
              <span>{formatDate(createDate)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

  );
};
// Các object chứa style
const styles = {
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
    padding: "30px",
    margin: "20px auto",
    maxWidth: "1200px",
  },
  container: {
    display: "grid",
    flexDirection: "column",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    position: "relative",
  },
  mainContent: {
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
  },
  leftColumn: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  middleColumn: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  rightColumn: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  column: {
    backgroundColor: "#F9F9F9",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  columnDivider: {
    borderLeft: "3px solid orange",
    paddingLeft: "20px",
  },
  backButton: {
    position: "absolute",
    top: "10px",
    left: "10px",
    backgroundColor: "#285430",
    color: "white",
    padding: "8px 12px", // Smaller padding for a compact button
    fontSize: "14px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    zIndex: 10, // Make sure it appears above other elements
    transition: "background-color 0.3s ease",
  },
  backButtonHover: {
    backgroundColor: "#1e3b28",
  },
  imageContainer: {
    position: "relative", // Make container position relative for absolute positioning of arrows
    // width: "600px", // Fixed width for consistency
    // height: "500px", // Fixed height to ensure consistency
    overflow: "hidden",
    borderRadius: "8px",
    // boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: '#f0f0f0' // Light background for better contrast
  },
  image: {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "cover",
  },
  arrowButton: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "24px",
    color: "#fff",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  leftArrow: {
    left: "10px",
  },
  rightArrow: {
    right: "10px",
  },
  arrowButtonHover: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  details: {
    width: "50%",
    marginLeft: "20px",
  },
  title: {
    fontSize: "28px",
    marginBottom: "10px",
    color: "#285430",
  },
  price: {
    fontSize: "24px",
    color: "red",
    marginBottom: "20px",
  },
  description: {
    marginBottom: "20px",
  },
  productInfo: {
    marginBottom: "10px",
  },
  quantitySelector: {
    display: "flex",
    alignItems: "center",
    marginBottom: "20px",
  },
  quantityButton: {
    padding: "10px",
    fontSize: "18px",
    cursor: "pointer",
  },
  quantityInput: {
    textAlign: "center",
    width: "50px",
    height: "40px",
    margin: "0 10px",
    fontSize: "18px",
  },
  addToCartButton: {
    backgroundColor: "#285430",
    color: "white",
    padding: "15px 30px",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
    marginBottom: "20px",
  },
  addToCartButtonHover: {
    backgroundColor: "#1e3b28",
  },
  wishlist: {
    fontSize: "18px",
    marginBottom: "20px",
  },
  description: {
    marginBottom: "20px",
    maxHeight: "150px", // Limiting the height (optional)
    overflow: "hidden", // Prevent overflow of text
    textOverflow: "ellipsis", // Adds '...' at the end of the text if it's too long
    whiteSpace: "normal", // Allows text to wrap properly
    lineHeight: "1.5", // Adjust the line height for better spacing
    fontSize: "16px", // Optional: Adjust font size to fit better
  },
  infoList: {
    listStyleType: "none", // Bỏ dấu chấm ở danh sách
    padding: 0,
    margin: 0,
  },
  infoListItem: {
    marginBottom: "10px", // Khoảng cách giữa các mục
    fontSize: "16px", // Tăng độ rõ ràng của text
  },
  infoGrid: {
    display: "block",
    gridTemplateColumns: "1fr 2fr", // Two-column layout (label and value)
    gap: "15px", // Space between the columns
    marginTop: "20px", // Add some space at the top
  },
  infoItem: {
    display: "flex",
    alignItems: "center",
  },
  infoLabel: {
    fontWeight: "bold",
    color: "#285430",
    marginRight: "10px",
  },
  link: {
    color: "#285430",
    cursor: "pointer",
    textDecoration: "underline",
  },
};
export default DetailProduct;
