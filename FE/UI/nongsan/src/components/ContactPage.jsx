import React from "react";
import Filters from "./Filters";

const ContactPage = () => {
  return (
    <>
      <Filters />
      <div className="container mx-auto p-6 bg-gray-50">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-semibold text-green-800 mb-6">Liên hệ</h1>
          <p className="text-lg text-gray-700 mb-6">
            Nếu bạn có bất kỳ câu hỏi nào hoặc cần hỗ trợ, vui lòng liên hệ
            với chúng tôi qua thông tin dưới đây:
          </p>

          <div className="mt-6">
            <div className="mb-4">
              <h2 className="text-2xl font-semibold text-green-700">Địa chỉ:</h2>
              <p className="text-lg text-gray-700">123 Nông sản Street, Thành phố Đà Nẵng, Việt Nam</p>
            </div>

            <div className="mb-4">
              <h2 className="text-2xl font-semibold text-green-700">Email:</h2>
              <p className="text-lg text-gray-700">tams@fpt.com</p>
            </div>

            <div className="mb-4">
              <h2 className="text-2xl font-semibold text-green-700">Số điện thoại:</h2>
              <p className="text-lg text-gray-700">(+84) 123 456 789</p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <h3 className="text-xl font-semibold text-green-700">Chúng tôi luôn sẵn sàng hỗ trợ bạn!</h3>
            <p className="mt-2 text-gray-700">
              Hãy liên hệ với chúng tôi nếu bạn có bất kỳ yêu cầu hoặc thắc mắc nào. Chúng tôi sẽ phản hồi trong thời gian sớm nhất.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;
