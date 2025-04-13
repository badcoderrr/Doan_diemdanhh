import React, { useEffect, useState } from "react";
import axios from "axios";

const DanhSachSinhVien = () => {
    const [sinhVien, setSinhVien] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/sinh-vien/');
                if (response.data?.status === 'success') {
                    setSinhVien(response.data.data);
                } else {
                    throw new Error('Dữ liệu không hợp lệ');
                }
            } catch (err) {
                setError(err.response?.data?.error || err.message);
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    if (loading) return <div className="loading">Đang tải...</div>;
    if (error) return <div className="error">Lỗi: {error}</div>;

    return (
        <div className="student-list-container">
            <h2>Danh Sách Sinh Viên</h2>
            <div className="student-grid">
                {sinhVien.map(sv => (
                    <div key={sv.id} className="student-card">
                        <div className="student-info">
                            <h3>{sv.ho_ten}</h3>
                            <p><strong>MSSV:</strong> {sv.ma_sinh_vien}</p>
                            <p><strong>Ngày sinh:</strong> {formatDate(sv.ngay_sinh)}</p>
                            <p><strong>Lớp:</strong> {sv.lop_display || 'N/A'}</p>
                            <p><strong>Khoa:</strong> {sv.khoa_display || 'N/A'}</p>
                        </div>
                        <div className="qr-code-container">
                            <img 
                                src={`http://localhost:8000${sv.qr_code}`} 
                                alt={`QR Code của ${sv.ho_ten}`} 
                                className="qr-code-image"
                                onError={(e) => e.target.style.display = 'none'}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DanhSachSinhVien;