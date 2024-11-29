import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

const Banner = () => {
  const navigate = useNavigate(); // Initialize navigate function

  // Function to handle "Shop Now" click event and navigate to product list
  const handleShopNowClick = () => {
    navigate(`/productlist`); // Navigate to the product list for the selected category
  };

  return (
    <div className="flex justify-center gap-6 p-6">
      {/* First Product Advertisement */}
      <div className="w-full sm:w-1/2 p-4 bg-white rounded-lg shadow-lg flex flex-col items-center">
        <div className="relative w-full">
          <img 
            src="https://file1.dangcongsan.vn/data/0/images/2021/08/05/vietha/ky2nnhc2.jpg?dpi=150&quality=100&w=780" 
            alt="Fresh Organic Fruits"
            className="w-full h-56 object-cover rounded-t-lg mb-4" // Set consistent height (h-56 or your choice)
          />
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black via-transparent to-transparent text-white p-4">
            <h5 className="card-title text-xl font-semibold mb-2">Trái Cây Hữu Cơ Tươi</h5> {/* Translated title */}
            <p className="card-text text-sm mb-4">
              Thưởng thức trái cây hữu cơ chất lượng tốt nhất trực tiếp từ nông trại. Được thu hoạch tươi mới và sẵn sàng giao đến tay bạn!
            </p>
            <button
              onClick={() => handleShopNowClick('Fruit')} // Navigate to Fruit category
              className="btn btn-primary bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition-colors"
            >
              Mua Ngay
            </button>
          </div>
        </div>
      </div>

      {/* Second Product Advertisement */}
      <div className="w-full sm:w-1/2 p-4 bg-white rounded-lg shadow-lg flex flex-col items-center">
        <div className="relative w-full">
          <img 
            src="https://special.vietnamplus.vn/wp-content/uploads/2021/03/nongsanvie-1595405197-19.jpg" 
            alt="Premium Organic Vegetables"
            className="w-full h-56 object-cover rounded-t-lg mb-4" // Consistent height here as well
          />
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black via-transparent to-transparent text-white p-4">
            <h5 className="card-title text-xl font-semibold mb-2">Rau Củ Hữu Cơ Cao Cấp</h5> {/* Translated title */}
            <p className="card-text text-sm mb-4">
              Nhận rau củ tươi, không thuốc trừ sâu trực tiếp từ nông dân địa phương. Khỏe mạnh và giá cả hợp lý cho mọi người.
            </p>
            <button
              onClick={() => handleShopNowClick('Vegetable')} // Navigate to Vegetable category
              className="btn btn-primary bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition-colors"
            >
              Mua Ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
