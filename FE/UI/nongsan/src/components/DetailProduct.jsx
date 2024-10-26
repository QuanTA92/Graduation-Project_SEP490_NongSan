import React, { useState } from "react";

const DetailProduct = () => {
  const [quantity, setQuantity] = useState(1);

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
      border: '1px solid #ddd', // Border cho ảnh
      borderRadius: '8px'
    },
    image: {
      width: '100%',
      height: 'auto',
      borderRadius: '8px'
    },
    details: {
      width: '50%',
      marginLeft: '20px' // Khoảng cách giữa ảnh và chi tiết sản phẩm
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
    productInfo: {
      marginBottom: '10px'
    },
    socialShare: {
      display: 'flex',
      gap: '10px',
      marginTop: '20px'
    },
    socialLink: {
      textDecoration: 'none',
      color: '#285430'
    },
    socialLinkHover: {
      textDecoration: 'underline'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.imageContainer}>
        <img style={styles.image} src="https://th.bing.com/th/id/OIP.ldCReM2VqpmFJoNgbyVJ6wHaHa?w=626&h=626&rs=1&pid=ImgDetMain" alt="Cà rốt hữu cơ" />
      </div>
      
      <div style={styles.details}>
        <h1 style={styles.title}>Cà Rốt</h1>
        <p style={styles.price}>560.000 đ</p>
        <p style={styles.description}>
          Cà rốt hữu cơ được trồng bởi những nông dân tâm huyết, hoàn toàn theo quy trình hữu cơ không sử dụng hóa chất. 
          Sản phẩm mang màu cam tươi sáng, giàu vitamin A, giúp cải thiện thị lực và tăng cường sức khỏe làn da. 
          Với sự chăm sóc kỹ lưỡng của người nông dân, cà rốt còn chứa nhiều chất xơ, hỗ trợ tiêu hóa, mang lại sức khỏe toàn diện cho gia đình bạn. 
          Thích hợp cho các món súp, nước ép, hoặc ăn trực tiếp.
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
          <p><strong>Danh mục:</strong> Rau</p>
          <p><strong>Từ khóa:</strong> Organic</p>
        </div>
      </div>
    </div>
  );
};

export default DetailProduct;