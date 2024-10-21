import React, { useState } from "react";
import { Link } from "react-router-dom"; // Thay đổi import

const EditProfile = () => {
  const [user, setUser] = useState({
    name: "Nguyễn Thị Mỹ Duyên",
    title: "Thương nhân nông sản",
    imageUrl: "https://scontent.fdad3-6.fna.fbcdn.net/v/t39.30808-6/458086235_1811452326049410_6529917886338204987_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=R9rdt1cwm2YQ7kNvgHYOFQf&_nc_ht=scontent.fdad3-6.fna&_nc_gid=APPRkCTccnlBTMo6ZmRAcoy&oh=00_AYBQFG2g1pPkIXFG8dnMIq6viQErfFAjd19tjPOolGMzUA&oe=670A4CE0",
    phone: "0123456789",
    address: "Đà Nẵng, Việt Nam",
    description: "Tận tâm trong từng sản phẩm",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Thông tin đã được cập nhật:", user);
  };

  return (
    <div className="flex flex-col items-center  h-screen p-4" >
      <div className="relative w-full h-52">
        <img src={user.imageUrl} alt="Avatar" className="w-40 h-40 rounded-full border-4 border-white absolute -bottom-20 left-1/2 transform -translate-x-1/2 object-cover" />
      </div>

      <div className="mt-32 text-center w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-green-900">Sửa Hồ Sơ</h1>
        <form onSubmit={handleSubmit} className="flex flex-wrap justify-between mt-6">
          <div className="w-full md:w-1/2 p-2">
            <label className="block text-lg font-medium text-green-900 mb-2">Tên:</label>
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleChange}
              className="w-full p-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="w-full md:w-1/2 p-2">
            <label className="block text-lg font-medium text-green-900 mb-2">Chức vụ:</label>
            <input
              type="text"
              name="title"
              value={user.title}
              onChange={handleChange}
              className="w-full p-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="w-full md:w-1/2 p-2">
            <label className="block text-lg font-medium text-green-900 mb-2">Số điện thoại:</label>
            <input
              type="text"
              name="phone"
              value={user.phone}
              onChange={handleChange}
              className="w-full p-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="w-full md:w-1/2 p-2">
            <label className="block text-lg font-medium text-green-900 mb-2">Địa chỉ:</label>
            <input
              type="text"
              name="address"
              value={user.address}
              onChange={handleChange}
              className="w-full p-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="w-full p-2">
            <label className="block text-lg font-medium text-green-900 mb-2">Miêu tả:</label>
            <textarea
              name="description"
              value={user.description}
              onChange={handleChange}
              className="w-full p-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 h-24"
            />
          </div>
          
          <button type="submit" className="mt-4 p-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition w-full">
            Lưu Thay Đổi
          </button>
        </form>

        <Link href="/profile" className="mt-4 inline-block text-green-600 hover:underline">
          Quay lại Hồ Sơ
        </Link>
      </div>
    </div>
  );
};

export default EditProfile;
