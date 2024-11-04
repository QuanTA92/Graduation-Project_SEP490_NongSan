import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProductService from "../services/ProductService";
import Slider from "react-slick";

const DetailProduct = () => {
  const [quantity, setQuantity] = useState(1);
  const { idProduct } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    ProductService.getProductById(idProduct)
      .then((response) => {
        console.log(response.data); // Check the structure of `imageProducts`
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
    specificAddressProduct
  } = product;

  // Utility function to format dates
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageProducts.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + imageProducts.length) % imageProducts.length
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

  // Hàm xử lý thêm vào danh sách yêu thích
  const handleWishlist = () => {
    console.log("Sản phẩm đã được thêm vào danh sách yêu thích");
  };

  // Các object chứa style
  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    },
    imageContainer: {
      position: 'relative', // Make container position relative for absolute positioning of arrows
      width: '700px', // Fixed width for consistency
      height: '400px', // Fixed height to ensure consistency
      overflow: 'hidden',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      // backgroundColor: '#f0f0f0' // Light background for better contrast
    },
    image: {
      maxWidth: '100%',
      maxHeight: '100%',
      objectFit: 'cover'
    },
    arrowButton: {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      fontSize: '24px',
      color: '#fff',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    },
    leftArrow: {
      left: '10px'
    },
    rightArrow: {
      right: '10px'
    },
    arrowButtonHover: {
      backgroundColor: 'rgba(0, 0, 0, 0.7)'
    },
    details: {
      width: '50%',
      marginLeft: '20px'
    },
    title: {
      fontSize: '28px',
      marginBottom: '10px',
      color: '#285430'
    },
    price: {
      fontSize: '24px',
      color: 'red',
      marginBottom: '20px'
    },
    description: {
      marginBottom: '20px'
    },
    productInfo: {
      marginBottom: '10px'
    },
    quantitySelector: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '20px'
    },
    quantityButton: {
      padding: '10px',
      fontSize: '18px',
      cursor: 'pointer'
    },
    quantityInput: {
      textAlign: 'center',
      width: '50px',
      height: '40px',
      margin: '0 10px',
      fontSize: '18px'
    },
    addToCartButton: {
      backgroundColor: '#285430',
      color: 'white',
      padding: '15px 30px',
      border: 'none',
      borderRadius: '5px',
      fontSize: '16px',
      cursor: 'pointer',
      marginBottom: '20px',
    },
    addToCartButtonHover: {
      backgroundColor: '#1e3b28'
    },
    wishlist: {
      fontSize: '18px',
      marginBottom: '20px'
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.imageContainer}>
      {imageProducts && imageProducts.length > 0 && (
        <>
          <img src={imageProducts[currentImageIndex]} alt={`Image of ${nameProduct}`} style={styles.image} />
          <span
            style={{ ...styles.arrowButton, ...styles.leftArrow }}
            onClick={prevImage}
            onMouseEnter={(e) => (e.target.style.backgroundColor = styles.arrowButtonHover.backgroundColor)}
            onMouseLeave={(e) => (e.target.style.backgroundColor = styles.arrowButton.backgroundColor)}
          >
            &#8592;
          </span>
          <span
            style={{ ...styles.arrowButton, ...styles.rightArrow }}
            onClick={nextImage}
            onMouseEnter={(e) => (e.target.style.backgroundColor = styles.arrowButtonHover.backgroundColor)}
            onMouseLeave={(e) => (e.target.style.backgroundColor = styles.arrowButton.backgroundColor)}
          >
            &#8594;
          </span>
        </>
      )}
    </div>
      
      <div style={styles.details}>
        <h1 style={styles.title}>{nameProduct}</h1>
        <p style={styles.price}>{priceProduct}.000 VNĐ</p>
        <p style={styles.description}>
          {descriptionProduct}
        </p>
        
        <div style={styles.quantitySelector}>
          <button style={styles.quantityButton} onClick={decrementQuantity}>-</button>
          <input style={styles.quantityInput} type="text" value={quantity} readOnly />
          <button style={styles.quantityButton} onClick={incrementQuantity}>+</button>
        </div>
        
        <button style={styles.addToCartButton}>Thêm vào giỏ hàng</button>

        <button style={styles.wishlist} onClick={handleWishlist}>
          ❤️ Yêu thích
        </button>

        <div style={styles.productInfo}>
          <p><strong>Danh mục:</strong> {nameSubcategory}</p>
          <p><strong>Số lượng:</strong> {quantityProduct}</p>
          <p><strong>Chất lượng:</strong> {qualityCheck}</p>
          <p><strong>Hạn sử dụng:</strong> {formatDate(expirationDate)}</p>
          <p><strong>Tình trạng:</strong> {statusProduct}</p>
          <p><strong>Nhà cung cấp:</strong> {nameHouseHold}</p>
          <p><strong>Địa chỉ:</strong> {specificAddressProduct}, {wardProduct}, {districtProduct}, {cityProduct}</p>
          <p><strong>Ngày tạo:</strong> {formatDate(createDate)}</p>
        </div>
      </div>
    </div>
  );
};

export default DetailProduct;
