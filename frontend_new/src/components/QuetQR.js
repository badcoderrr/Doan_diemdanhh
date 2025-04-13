import React, { useState } from 'react';
import { QrScanner } from '@yudiel/react-qr-scanner';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const QuetQR = () => {
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [scanActive, setScanActive] = useState(true);

  const parseQRData = (qrData) => {
    if (!qrData) return null;
    
    if (qrData.includes('|')) {
      const parts = qrData.split('|');
      return {
        ma_sinh_vien: parts[0],
        ho_ten: parts[1],
        lop: parts[2],
        khoa: parts[3]
      };
    }
    
    return null;
  };

  const handleDiemDanh = async (qrData) => {
    const studentInfo = parseQRData(qrData);
    if (!studentInfo?.ma_sinh_vien) {
      toast.error('Mã QR không hợp lệ', { position: "top-right", autoClose: 3000 });
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const { data } = await axios.post('http://localhost:8000/api/diem-danh/', {
        ma_sinh_vien: studentInfo.ma_sinh_vien
      });

      setScanResult({
        rawData: qrData,
        studentInfo: studentInfo,
        timestamp: new Date().toLocaleString('vi-VN'),
        apiResponse: data
      });

      toast.success(`Đã điểm danh thành công cho ${studentInfo.ho_ten}`, {
        position: "top-right",
        autoClose: 3000,
      });

      setScanActive(false);
      setTimeout(() => setScanActive(true), 3000);
      
    } catch (err) {
      const errorMessage = err.response?.data?.error || 
                         err.message || 
                         'Lỗi hệ thống';
      setError(errorMessage);
      toast.error(errorMessage, { position: "top-right", autoClose: 3000 });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="qr-container">
      <div className="qr-header">
        <div className="qr-title-box">
          <h2 className="qr-title">
            <span className="qr-icon">📷</span>
            QUÉT MÃ QR ĐIỂM DANH
            <span className="qr-icon">📷</span>
          </h2>
        </div>
        <div className="qr-subtitle">Đưa mã QR vào khung hình để điểm danh</div>
      </div>
      
      <div className="qr-scanner-wrapper">
        <div className="qr-frame-decoration top-left"></div>
        <div className="qr-frame-decoration top-right"></div>
        <div className="qr-frame-decoration bottom-left"></div>
        <div className="qr-frame-decoration bottom-right"></div>
        
        <div className={`qr-scanner-container ${scanActive ? 'scanning' : ''}`}>
          {scanActive ? (
            <QrScanner
              onDecode={handleDiemDanh}
              onError={(error) => {
                console.error('Lỗi camera:', error);
                setError(`Lỗi camera: ${error.message}`);
                setScanActive(false);
              }}
              constraints={{ facingMode: 'environment' }}
              scanDelay={500}
            />
          ) : (
            <div className="qr-paused-overlay">
              <div className="qr-paused-content">
                <div className="qr-paused-icon">⏸</div>
                <p className="qr-paused-text">TẠM DỪNG</p>
                {!isLoading && (
                  <button 
                    onClick={() => setScanActive(true)}
                    className="qr-resume-btn"
                  >
                    TIẾP TỤC QUÉT
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {isLoading && (
        <div className="qr-loading-overlay">
          <div className="qr-loading-spinner"></div>
          <p>Đang xử lý điểm danh...</p>
        </div>
      )}

      {scanResult && (
        <div className="qr-result-container">
          <h3>Thông tin điểm danh</h3>
          <div className="qr-result-details">
            <p><strong>Mã vừa quét:</strong> {scanResult.rawData}</p>
            <p><strong>Tên sinh viên:</strong> {scanResult.studentInfo.ho_ten}</p>
            <p><strong>MSSV:</strong> {scanResult.studentInfo.ma_sinh_vien}</p>
            <p><strong>Lớp:</strong> {scanResult.studentInfo.lop || 'N/A'}</p>
            <p><strong>Khoa:</strong> {scanResult.studentInfo.khoa || 'N/A'}</p>
            <p><strong>Thời gian:</strong> {scanResult.timestamp}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="qr-error-container">
          <p>{error}</p>
        </div>
      )}

      <div className="qr-controls">
        <button 
          onClick={() => setScanActive(!scanActive)}
          className={`qr-toggle-btn ${scanActive ? 'stop' : 'start'}`}
          disabled={isLoading}
        >
          {scanActive ? '⏸ TẠM DỪNG' : '▶ BẮT ĐẦU QUÉT'}
        </button>
      </div>

      <style jsx>{`
        /* Reset highlight */
        .qr-title, .qr-subtitle {
          user-select: none;
          -webkit-user-select: none;
        }
        
        /* Main container */
        .qr-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          font-family: 'Segoe UI', sans-serif;
        }
        
        /* Header styles */
        .qr-header {
          text-align: center;
          margin-bottom: 30px;
        }
        
        .qr-title {
          font-size: 1.8rem;
          color: #2c3e50;
          margin-bottom: 10px;
          position: relative;
          display: inline-block;
        }
        .qr-title-box {
          padding: 15px 30px;
          border-radius: 50px;
          background: linear-gradient(135deg,rgb(67, 24, 237), #ff8e53);
          display: inline-block;
          margin-bottom: 15px;
          box-shadow: 0 4px 15px rgba(235, 19, 19, 0.3);
         
        
        .qr-title .qr-icon {
          margin: 0 10px;
          display: inline-block;
          animation: pulse 2s infinite;
        }
        
        .qr-subtitle {
          font-size: 1rem;
          color: #7f8c8d;
        }
        
        /* Scanner area */
        .qr-scanner-wrapper {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
          margin-bottom: 20px;
          background: #000;
        }
        
        .qr-scanner-container {
          position: relative;
          width: 100%;
          aspect-ratio: 1;
        }
        
        /* Frame decorations */
        .qr-frame-decoration {
          position: absolute;
          width: 40px;
          height: 40px;
          border-color: #3498db;
          z-index: 10;
        }
        
        .top-left {
          top: 10px;
          left: 10px;
          border-width: 3px 0 0 3px;
          border-radius: 12px 0 0 0;
        }
        
        /* ... (các frame decoration khác) ... */
        
        /* Loading overlay */
        .qr-loading-overlay {
          /* ... (giữ nguyên) ... */
        }
        
        /* Result & error styles */
        .qr-result-container {
          /* ... (giữ nguyên) ... */
        }
        
        /* Controls */
        .qr-toggle-btn {
          /* ... (giữ nguyên) ... */
        }
        
        /* Animations */
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default QuetQR;