"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

const Register = () => {
    const [error, setError] = useState("");
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true); // Router is mounted when component is mounted
    }, []);

    const isValidEmail = (email: string) => {
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        return emailRegex.test(email);
    };

    const isValidPassword = (password: string) => {
        return password.length >= 6;
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const name = e.target[0].value;
        const email = e.target[1].value;
        const password = e.target[2].value;

        if (!isValidEmail(email)) {
            setError("Email không hợp lệ");
            return;
        }

        if (!isValidPassword(password)) {
            setError("Mật khẩu cần ít nhất 6 ký tự");
            return;
        }

        if (isMounted) {
            try {
                router.push("/detailregister");
            } catch (error) {
                setError("Đã xảy ra lỗi, vui lòng thử lại.");
            }
        } else {
            setError("Router chưa được gắn.");
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gradient-to-r from-green-200 via-yellow-200 to-green-400 pt-[120px] ">
            <div className="w-full p-8 m-auto bg-white rounded-lg shadow-lg max-w-lg">
                <h1 className="text-4xl font-bold text-center text-green-700 mb-6">Tạo Tài Khoản</h1>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-lg font-medium text-green-900">Tên</label>
                        <input
                            type="text"
                            placeholder="Nhập tên của bạn"
                            required
                            className="w-full p-3 mt-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                    <div>
                        <label className="block text-lg font-medium text-green-900">Email</label>
                        <input
                            type="text"
                            placeholder="Nhập email của bạn"
                            required
                            className="w-full p-3 mt-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                    <div>
                        <label className="block text-lg font-medium text-green-900">Mật Khẩu</label>
                        <input
                            type="password"
                            placeholder="Nhập mật khẩu"
                            required
                            className="w-full p-3 mt-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                    <button type="submit" className="w-full p-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition">
                        Tiếp tục
                    </button>
                    {error && <p className="text-red-600 text-center mt-4">{error}</p>}
                </form>
                <div className="mt-6 text-center text-gray-600">Hoặc</div>
                <Link href="/login" className="block text-center text-green-600 hover:underline mt-4">
                    Đăng nhập với tài khoản hiện có
                </Link>
            </div>
        </div>
    );
};

export default Register;