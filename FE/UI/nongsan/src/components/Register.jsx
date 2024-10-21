import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import axios from 'axios'; // Import axios

const Register = () => {
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [isMounted, setIsMounted] = useState(false);
    const [fullname, setName] = useState(""); // Add state for name
    const [email, setEmail] = useState(""); // Add state for email
    const [password, setPassword] = useState(""); // Add state for password
    const [role, setRole] = useState("0"); // Default to "Người Mua"

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const isValidEmail = (email) => {
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        return emailRegex.test(email);
    };

    const isValidPassword = (password) => {
        return password.length >= 6;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

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
                const response = await axios.post("http://localhost:8080/auth/signup", {
                    fullname,
                    email,
                    password,
                    role: parseInt(role) // Pass the selected role as an integer
                });

                // Handle successful registration here (e.g., show a success message)
                console.log(response.data);
                navigate("/detailregister");
            } catch (error) {
                setError("Đã xảy ra lỗi, vui lòng thử lại.");
                console.error("Error details:", error.response?.data || error);
            }
        } else {
            setError("Component chưa được gắn.");
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gradient-to-r pt-[30px]">
            <div className="w-full p-8 m-auto bg-white rounded-lg shadow-lg max-w-lg">
                <h1 className="text-4xl font-bold text-center text-green-700 mb-6">Tạo Tài Khoản</h1>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-lg font-medium text-green-900">Tên</label>
                        <input
                            type="text"
                            placeholder="Nhập tên của bạn"
                            value={fullname}
                            onChange={(e) => setName(e.target.value)} // Update state for name
                            required
                            className="w-full p-3 mt-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                    <div>
                        <label className="block text-lg font-medium text-green-900">Email</label>
                        <input
                            type="text"
                            placeholder="Nhập email của bạn"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} // Update state for email
                            required
                            className="w-full p-3 mt-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                    <div>
                        <label className="block text-lg font-medium text-green-900">Mật Khẩu</label>
                        <input
                            type="password"
                            placeholder="Nhập mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} // Update state for password
                            required
                            className="w-full p-3 mt-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                    <div>
                        <label className="block text-lg font-medium text-green-900">Loại Người Dùng</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full p-3 mt-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        >
                            <option value="0">Người Mua</option>
                            <option value="1">Người Bán</option>
                        </select>
                    </div>
                    <button type="submit" className="w-full p-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition">
                        Tiếp tục
                    </button>
                    {error && <p className="text-red-600 text-center mt-4">{error}</p>}
                </form>
                <div className="mt-6 text-center text-gray-600">Hoặc</div>
                <Link to="/login" className="block text-center text-green-600 hover:underline mt-4">
                    Đăng nhập với tài khoản hiện có
                </Link>
            </div>
        </div>
    );
};

export default Register;
