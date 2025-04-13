import React, { useEffect, useState } from "react";
import axios from "axios";

const LichSuDiemDanh = () => {
    const [diemDanh, setDiemDanh] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/lich-su-diem-danh/');
                if (response.data?.status === 'success') {
                    setDiemDanh(response.data.data);
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

    const formatDateTime = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN');
    };

    if (loading) return <div className="loading">Đang tải...</div>;
    if (error) return <div className="error">Lỗi: {error}</div>;

    return (
        <div className="attendance-history">
            <h1>Lịch sử điểm danh</h1>
            <div className="history-table-container">
                <table className="history-table">
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>MSSV</th>
                            <th>Tên sinh viên</th>
                            <th>Lớp</th>
                            <th>Khoa</th>
                            <th>Thời gian</th>
                        </tr>
                    </thead>
                    <tbody>
                        {diemDanh.map((item, index) => (
                            <tr key={item.id}>
                                <td>{index + 1}</td>
                                <td>{item.sinh_vien_info?.ma_sinh_vien || 'N/A'}</td>
                                <td>{item.sinh_vien_info?.ho_ten || 'N/A'}</td>
                                <td>{item.sinh_vien_info?.lop || 'N/A'}</td>
                                <td>{item.sinh_vien_info?.khoa || 'N/A'}</td>
                                <td>{formatDateTime(item.thoi_gian)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LichSuDiemDanh;