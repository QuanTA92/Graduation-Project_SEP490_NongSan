"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const DetailRegister = () => {
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const fullname = e.target[0].value;
        const phone = e.target[1].value;
        const address = e.target[2].value;
        const description = e.target[3].value;

        // Validate the form
        if (!fullname || !phone || !address) {
            setError("Vui lòng điền đầy đủ thông tin.");
            return;
        }

        // Fake success or redirect to the login page
        router.push("/login");
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gradient-to-r from-green-200 via-yellow-200 to-green-400 pt-[110px]">
            <div className="w-full p-8 m-auto bg-white rounded-lg shadow-lg max-w-lg ">
                <h1 className="text-4xl font-bold text-center text-green-700 mb-6">Thông Tin Chi Tiết</h1>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-lg font-medium text-green-900">Họ và Tên</label>
                        <input
                            type="text"
                            placeholder="Nhập họ và tên"
                            required
                            className="w-full p-3 mt-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                    <div>
                        <label className="block text-lg font-medium text-green-900">Số Điện Thoại</label>
                        <input
                            type="tel"
                            placeholder="Nhập số điện thoại"
                            required
                            className="w-full p-3 mt-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                    <div>
                        <label className="block text-lg font-medium text-green-900">Địa Chỉ</label>
                        <input
                            type="text"
                            placeholder="Nhập địa chỉ của bạn"
                            required
                            className="w-full p-3 mt-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                    <div>
                        <label className="block text-lg font-medium text-green-900">Mô Tả</label>
                        <textarea
                            placeholder="Nhập mô tả ngắn gọn"
                            className="w-full p-3 mt-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        ></textarea>
                    </div>
                    <button type="submit" className="w-full p-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition">
                        Hoàn Tất
                    </button>
                    {error && <p className="text-red-600 text-center mt-4">{error}</p>}
                </form>
            </div>
        </div>
    );
};

export default DetailRegister;