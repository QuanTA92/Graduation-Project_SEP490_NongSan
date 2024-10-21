import React from "react";
import { Link } from "react-router-dom"; // Thay đổi import

const Profile = () => {
  const user = {
    name: "Nguyễn Thị Mỹ Duyên",
    title: "Thương nhân nông sản",
    profilePicture: "https://scontent.fdad3-6.fna.fbcdn.net/v/t39.30808-6/458086235_1811452326049410_6529917886338204987_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=R9rdt1cwm2YQ7kNvgHYOFQf&_nc_ht=scontent.fdad3-6.fna&_nc_gid=APPRkCTccnlBTMo6ZmRAcoy&oh=00_AYBQFG2g1pPkIXFG8dnMIq6viQErfFAjd19tjPOolGMzUA&oe=670A4CE0",
    backgroundUrl: "https://www.jjay.cuny.edu/sites/default/files/2023-09/veg-fruits.jpg",
    phone: "0123456789",
    address: "Đà Nẵng, Việt Nam",
    description: "Tận tâm trong từng sản phẩm nông sản.",
    orders: 150,
    productsSold: 1200,
    revenue: "500 triệu VND",
  };

  return (
    <div className="relative min-h-screen" style={{ padding: "20px" }}>
      {/* Background and Header */}
      <div className="relative w-full h-64 bg-cover bg-center" style={{ backgroundImage: `url(${user.backgroundUrl})` }}>
        <div className="absolute inset-0 bg-gradient-to-r "></div>
        <div className="absolute inset-x-0 bottom-0 text-center">
          <img
            src={user.profilePicture}
            alt="Profile"
            className="w-40 h-40 rounded-full border-4 border-white mx-auto -mb-20 object-cover"
          />
        </div>
      </div>

      {/* Main Info Section */}
      <div className="pt-24 text-center">
        <h1 className="text-4xl font-bold text-green-900">{user.name}</h1>
        <p className="text-xl text-green-600">{user.title}</p>
        <Link to="/edit-profile"> {/* Sử dụng Link từ react-router-dom */}
          <button className="bg-green-500 text-white rounded-full px-6 py-2 mt-4">
            Chỉnh sửa hồ sơ
          </button>
        </Link>
      </div>

      {/* Info Card Section */}
      <div className="mx-auto w-full max-w-4xl mt-12 p-8 bg-white rounded-xl shadow-lg flex justify-between" style={{ fontSize: "18px" }}>
        <div className="w-1/2 text-left">
          <p className="text-lg font-semibold text-green-900">Thông tin liên hệ</p>
          <p className="text-gray-700">Số điện thoại: {user.phone}</p>
          <p className="text-gray-700">Địa chỉ: {user.address}</p>
          <p className="text-gray-700">Miêu tả: {user.description}</p>
        </div>
        <div className="w-1/2 text-right">
          <p className="text-lg font-semibold text-green-900">Thống kê</p>
          <p className="text-gray-700">Đơn hàng: {user.orders}</p>
          <p className="text-gray-700">Sản phẩm đã bán: {user.productsSold}</p>
          <p className="text-gray-700">Doanh thu: {user.revenue}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
