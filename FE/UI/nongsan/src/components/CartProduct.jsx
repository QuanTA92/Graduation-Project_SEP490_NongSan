import React from "react";

const CartProduct = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Giỏ hàng của bạn</h1>
      <p>Hiện tại bạn chưa có sản phẩm nào trong giỏ hàng.</p>
      {/* Bạn có thể thêm logic hiển thị sản phẩm trong giỏ hàng tại đây */}
    </div>
  );
};

export default CartProduct;