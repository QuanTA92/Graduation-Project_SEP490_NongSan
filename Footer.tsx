'use client';

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-12">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Cột 1 - Hỗ trợ */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Hỗ trợ</h4>
          <ul className="text-gray-700 space-y-2">
            <li>Trung tâm trợ giúp</li>
            <li>AirCover</li>
            <li>Chống phân biệt đối xử</li>
            <li>Hỗ trợ người khuyết tật</li>
            <li>Các tuỳ chọn huỷ</li>
            <li>Báo cáo lo ngại của khu dân cư</li>
          </ul>
        </div>

        {/* Cột 2 - Đón tiếp khách */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Đón tiếp khách</h4>
          <ul className="text-gray-700 space-y-2">
            <li>Cho thuê nhà trên Airbnb</li>
            <li>AirCover cho Chủ nhà</li>
            <li>Tài nguyên về đón tiếp khách</li>
            <li>Diễn đàn cộng đồng</li>
            <li>Đón tiếp khách có trách nhiệm</li>
            <li>Tham gia khoá học miễn phí về công việc Đón tiếp khách</li>
          </ul>
        </div>

        {/* Cột 3 - Airbnb */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Airbnb</h4>
          <ul className="text-gray-700 space-y-2">
            <li>Trang tin tức</li>
            <li>Tính năng mới</li>
            <li>Cơ hội nghề nghiệp</li>
            <li>Nhà đầu tư</li>
            <li>Chỗ ở khẩn cấp Airbnb.org</li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
