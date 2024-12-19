import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CarouselManager = () => {
    const [carousels, setCarousels] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        idCarousel: '',
        titleCarousel: '',
        descriptionCarousel: '',
        imageCarousel: null,
    });
    const [editing, setEditing] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [carouselToDelete, setCarouselToDelete] = useState(null);

    const apiBase = 'http://localhost:8080/api/carousel';
    const token = localStorage.getItem('token'); // Lấy token từ localStorage

    const axiosInstance = axios.create({
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    // Fetch carousels
    const fetchCarousels = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`${apiBase}/get`);
            setCarousels(response.data);
        } catch (error) {
            console.error('Error fetching carousels:', error);
        }
        setLoading(false);
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            setFormData({ ...formData, [name]: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = new FormData();
        form.append('titleCarousel', formData.titleCarousel);
        form.append('descriptionCarousel', formData.descriptionCarousel);
        if (formData.imageCarousel) {
            form.append('imageCarousel', formData.imageCarousel);
        }

        try {
            if (editing) {
                await axiosInstance.put(`${apiBase}/update/${formData.idCarousel}`, form);
                toast.success('Sửa thành công!');
            } else {
                await axiosInstance.post(`${apiBase}/add`, form);
                toast.success('Thêm thành công!');
            }
            fetchCarousels();
            setFormData({ idCarousel: '', titleCarousel: '', descriptionCarousel: '', imageCarousel: null });
            setEditing(false);
            setShowForm(false);
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    // Handle edit
    const handleEdit = (carousel) => {
        setFormData({
            idCarousel: carousel.idCarousel,
            titleCarousel: carousel.titleCarousel,
            descriptionCarousel: carousel.descriptionCarousel,
            imageCarousel: null,
        });
        setEditing(true);
        setShowForm(true);
    };

    // Handle delete
    const handleDelete = (carousel) => {
        setCarouselToDelete(carousel);  // Lưu carousel cần xóa
        setShowConfirmModal(true); // Hiển thị modal xác nhận
    };

    const handleConfirmDelete = async () => {
        if (carouselToDelete) {
            try {
                await axiosInstance.delete(`${apiBase}/delete/${carouselToDelete.idCarousel}`);
                toast.success('Xóa thành công!');
                fetchCarousels();
            } catch (error) {
                console.error('Error deleting carousel:', error);
            }
        }
        setShowConfirmModal(false); // Đóng modal
    };

    const handleCancelDelete = () => {
        setShowConfirmModal(false); // Đóng modal
    };

    useEffect(() => {
        fetchCarousels();
    }, []);

    return (
        <div style={styles.container}>
            <ToastContainer
                position="bottom-left" // Hiển thị thông báo ở góc dưới bên trái
                autoClose={3000} // Thời gian tự động đóng (ms)
                hideProgressBar={false} // Hiển thị thanh tiến trình
                newestOnTop={false} // Thông báo mới nhất không hiển thị trên cùng
                closeOnClick // Đóng thông báo khi click
                rtl={false} // Không dùng chế độ RTL
                pauseOnFocusLoss // Tạm dừng khi mất tiêu điểm
                draggable // Có thể kéo thông báo
                pauseOnHover // Tạm dừng khi hover vào thông báo
            />

            <h1 className="text-2xl font-bold mb-4 text-center">Quản lý Carousel Nông Sản</h1>
            <button style={{ ...styles.button, ...styles.btnAdd }} onClick={() => setShowForm(true)}>
                + Thêm Sản Phẩm
            </button>

            {loading ? (
                <p>Đang tải...</p>
            ) : (
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={{ ...styles.thTd, ...styles.th }}>ID</th>
                            <th style={{ ...styles.thTd, ...styles.th }}>Tên Sản Phẩm</th>
                            <th style={{ ...styles.thTd, ...styles.th }}>Mô Tả</th>
                            <th style={{ ...styles.thTd, ...styles.th }}>Hình Ảnh</th>
                            <th style={{ ...styles.thTd, ...styles.th }}>Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {carousels.map((carousel) => (
                            <tr key={carousel.idCarousel}>
                                <td style={styles.thTd}>{carousel.idCarousel}</td>
                                <td style={styles.thTd}>{carousel.titleCarousel}</td>
                                <td style={styles.thTd}>{carousel.descriptionCarousel}</td>
                                <td style={styles.thTd}>
                                    <img src={carousel.imageCarousel} alt={carousel.titleCarousel} style={styles.image} />
                                </td>
                                <td style={styles.thTd}>
                                    <button
                                        style={{ ...styles.button, ...styles.btnEdit }}
                                        onClick={() => handleEdit(carousel)}
                                    >
                                        Sửa
                                    </button>
                                    <button
                                        style={{ ...styles.button, ...styles.btnDelete }}
                                        onClick={() => handleDelete(carousel)}
                                    >
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {showForm && (
                <>
                    <div style={styles.overlay} onClick={() => setShowForm(false)} />
                    <div style={styles.modal}>
                        <button style={styles.closeButton} onClick={() => setShowForm(false)}>
                            &times;
                        </button>
                        <form onSubmit={handleSubmit}>
                            <h2 style={styles.formHeading}>
                                {editing ? 'Cập nhật Sản Phẩm' : 'Thêm Sản Phẩm'}
                            </h2>
                            <label style={styles.label}>Tên Sản Phẩm:</label>
                            <input
                                style={styles.input}
                                type="text"
                                name="titleCarousel"
                                value={formData.titleCarousel}
                                onChange={handleInputChange}
                                required
                            />
                            <label style={styles.label}>Mô Tả:</label>
                            <input
                                style={styles.input}
                                type="text"
                                name="descriptionCarousel"
                                value={formData.descriptionCarousel}
                                onChange={handleInputChange}
                                required
                            />
                            <label style={styles.label}>Hình Ảnh:</label>
                            <input
                                style={styles.input}
                                type="file"
                                name="imageCarousel"
                                onChange={handleInputChange}
                            />
                            <div style={styles.formActions}>
                                <button
                                    style={{ ...styles.button, ...styles.btnAdd }}
                                    type="submit"
                                >
                                    {editing ? 'Cập nhật' : 'Thêm'}
                                </button>
                                <button
                                    style={{ ...styles.button, ...styles.cancelButton }}
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                >
                                    Hủy
                                </button>
                            </div>
                        </form>
                    </div>
                </>
            )}

            {showConfirmModal && (
                <div style={styles.overlay}>
                    <div style={styles.modal}>
                        <h3 style={styles.confirmHeading}>Bạn có chắc chắn muốn xóa sản phẩm này?</h3>
                        <div style={styles.confirmActions}>
                            <button style={{ ...styles.button, ...styles.btnDelete }} onClick={handleConfirmDelete}>
                                Xóa
                            </button>
                            <button style={{ ...styles.button, ...styles.cancelButton }} onClick={handleCancelDelete}>
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f9f9f9',
        paddingTop: '4rem', // Thêm padding-top
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '20px',
    },
    thTd: {
        padding: '10px',
        textAlign: 'center',
        border: '1px solid #ddd',
    },
    th: {
        backgroundColor: '#6cbb3c',
        color: 'white',
    },
    image: {
        width: '120px',
        height: '80px',
        objectFit: 'cover',
        display: "block", // Để căn giữa
        margin: "auto", // Căn giữa hình ảnh
    },
    button: {
        padding: '10px 20px',
        margin: '5px',
        border: 'none',
        cursor: 'pointer',
        borderRadius: '5px',
        fontWeight: 'bold',
    },
    btnAdd: {
        backgroundColor: '#6cbb3c',
        color: 'white',
    },
    btnEdit: {
        backgroundColor: '#f0ad4e',
        color: 'white',
    },
    btnDelete: {
        backgroundColor: '#d9534f',
        color: 'white',
    },
    modal: {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'white',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
        zIndex: 1000,
        width: '400px',
        maxWidth: '90%',
    },
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 999,
    },
    formHeading: {
        marginBottom: '20px',
        textAlign: 'center',
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#333',
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        fontWeight: 'bold',
        color: '#555',
    },
    input: {
        width: '100%',
        padding: '10px',
        marginBottom: '15px',
        borderRadius: '5px',
        border: '1px solid #ccc',
    },
    formActions: {
        display: 'flex',
        justifyContent: 'space-between',
        gap: '10px',
    },
    cancelButton: {
        backgroundColor: '#ccc',
        color: '#333',
    },
    closeButton: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
        fontSize: '20px',
        color: '#888',
    },
    confirmHeading: {
        marginBottom: '20px',
        textAlign: 'center',
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#333',
    },
    confirmActions: {
        display: 'flex',
        justifyContent: 'space-around',
        gap: '10px',
    },
};

export default CarouselManager;
