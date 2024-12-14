import React from "react";
import Filters from "./Filters";

const AboutPage = () => {
  return (
    <>
      <Filters />
      <div className="container mx-auto p-6 bg-gray-50">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-semibold text-green-800 mb-6">
            Giới thiệu về Nông sản
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed">
            Nông sản Việt Nam là nền tảng cung cấp các sản phẩm nông sản chất
            lượng cao từ các nhà sản xuất uy tín. Chúng tôi cam kết cung cấp
            những sản phẩm tươi ngon, an toàn và đảm bảo nguồn gốc xuất xứ rõ
            ràng.
          </p>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-green-700">Sứ mệnh của chúng tôi</h2>
            <p className="text-lg text-gray-700 mt-4 leading-relaxed">
              Chúng tôi nhằm kết nối các nông dân và người tiêu dùng, tạo ra một
              thị trường nông sản minh bạch, thuận tiện và bền vững. Bằng cách
              cung cấp các sản phẩm nông sản trực tuyến, chúng tôi hy vọng sẽ
              mang lại giá trị lâu dài cho cộng đồng.
            </p>
          </div>

          {/* Image Section */}
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-green-700">Nông sản của chúng tôi</h2>
            <div className="mt-4 flex justify-center">
              <img
                src="https://imgcdn.tapchicongthuong.vn/tcct-media/21/8/2/nong_san_sach.jpg" // Liên kết hình ảnh của bạn
                alt="Nông sản sạch"
                className="rounded-lg shadow-md max-w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutPage;
