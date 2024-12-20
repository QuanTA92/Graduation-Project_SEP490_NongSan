import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import userService from "../services/UserService"; // Import file chứa hàm updateUserInfo

const AddProfile = () => {
  const { token } = useContext(AuthContext); // Lấy token từ AuthContext
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    fullName: "", // Thêm trường fullName vào state
    address: "",
    phone: "",
    description: "",
    userImage: [], // Add image state to handle multiple images
    imagePreviewUrls: [] // State for image previews
  });

  const [error, setError] = useState("");

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  // Xử lý thay đổi cho file input
  const handleFileChange = (e) => {
    const files = e.target.files;

    // Kiểm tra xem người dùng đã chọn nhiều hơn 2 ảnh chưa
    if (files.length > 2) {
      setError("Bạn chỉ có thể tải lên tối đa 2 ảnh.");
      return;
    }

    setError(""); // Clear error nếu người dùng chọn không quá 2 ảnh

    // Cập nhật state với ảnh đã chọn
    const imagePreviewUrls = Array.from(files).map((file) =>
      URL.createObjectURL(file)
    );

    setProfile((prevProfile) => ({
      ...prevProfile,
      userImage: files,
      imagePreviewUrls: imagePreviewUrls, // Lưu trữ URL tạm thời của ảnh
    }));
  };

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Tạo FormData để gửi dữ liệu và hình ảnh
      const formData = new FormData();
      formData.append("fullName", profile.fullName);
      formData.append("address", profile.address);
      formData.append("phone", profile.phone);
      formData.append("description", profile.description);

      // Chỉ gửi tối đa 2 ảnh
      const imagesToSend = profile.userImage.length > 2 ? profile.userImage.slice(0, 2) : profile.userImage;

      // Thêm các hình ảnh vào FormData
      for (let i = 0; i < imagesToSend.length; i++) {
        formData.append("userImage", imagesToSend[i]);
      }

      // Gọi hàm updateUserInfo từ service, truyền FormData
      await userService.updateUserInfo(token, formData);
      
      // Chuyển hướng người dùng đến trang hồ sơ
      navigate("/profile");
    } catch (err) {
      console.error("Lỗi khi cập nhật hồ sơ:", err.response?.data || err);
      setError("Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-green-200 via-yellow-200 to-green-400 p-[29.5rem]">
      <div className="w-full p-8 bg-white rounded-lg shadow-lg max-w-lg">
        <h1 className="text-3xl font-bold text-center text-green-700 mb-6">
          Thêm Hồ Sơ Của Bạn
        </h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Trường Họ và Tên */}
          <div>
            <label className="block text-lg font-medium text-green-900">
              Họ và Tên
            </label>
            <input
              type="text"
              name="fullName"
              placeholder="Nhập họ và tên của bạn"
              value={profile.fullName}
              onChange={handleChange}
              required
              className="w-full p-3 mt-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Trường Địa chỉ */}
          <div>
            <label className="block text-lg font-medium text-green-900">
              Địa chỉ
            </label>
            <input
              type="text"
              name="address"
              placeholder="Nhập địa chỉ của bạn"
              value={profile.address}
              onChange={handleChange}
              required
              className="w-full p-3 mt-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Trường Số điện thoại */}
          <div>
            <label className="block text-lg font-medium text-green-900">
              Số điện thoại
            </label>
            <input
              type="text"
              name="phone"
              placeholder="Nhập số điện thoại"
              value={profile.phone}
              onChange={handleChange}
              required
              className="w-full p-3 mt-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Trường Miêu tả */}
          <div>
            <label className="block text-lg font-medium text-green-900">
              Miêu tả
            </label>
            <textarea
              name="description"
              placeholder="Nhập miêu tả về bạn"
              value={profile.description}
              onChange={handleChange}
              required
              className="w-full p-3 mt-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 h-24"
            ></textarea>
          </div>

          {/* Trường Tải ảnh */}
          <div>
            <label className="block text-lg font-medium text-green-900">
              Tải lên ảnh
            </label>
            <input
              type="file"
              name="userImage"
              multiple
              onChange={handleFileChange}
              className="w-full p-3 mt-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
            {/* Thông báo lỗi nếu người dùng chọn quá 2 ảnh */}
            {error && <p className="text-red-600 mt-2">{error}</p>}
          </div>

          {/* Hiển thị các ảnh đã chọn */}
          {profile.imagePreviewUrls.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-medium text-green-900">Ảnh đã chọn:</h3>
              <div className="flex space-x-4 mt-2">
                {profile.imagePreviewUrls.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`Preview ${index}`}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Nút Submit */}
          <button
            type="submit"
            className="w-full p-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
          >
            Lưu Hồ Sơ
          </button>

          {/* Thông báo lỗi */}
          {error && <p className="text-red-600 text-center mt-4">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default AddProfile;
