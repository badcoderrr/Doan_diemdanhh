import logo from './logo.jpg';
import './App.css';
import React from "react";
import DanhSachSinhVien from "./components/DanhSachSinhVien";
import { BrowserRouter as Router, Route, Routes, NavLink } from "react-router-dom";
import QuetQR from "./components/QuetQR";
import LichSuDiemDanh from "./components/LichSuDiemDanh";

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <div className="app-header-content">
            <div className="header-top">
              <img 
                src={logo} 
                className="App-logo" 
                alt="logo" 
              />
              <h1 className="app-title">Ứng dụng điểm danh sinh viên</h1>
            </div>
            
            <nav className="main-nav">
              <NavLink 
                to="/sinh-vien" 
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              >
                Danh Sách Sinh Viên
              </NavLink>
              <NavLink 
                to="/quet-qr"
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              >
                Quét mã QR
              </NavLink>
              <NavLink 
                to="/lich-su-diem-danh"
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              >
                Lịch sử điểm danh
              </NavLink>
            </nav>
          </div>

          <div className="content-container">
            <Routes>
              <Route path="/" element={<DanhSachSinhVien />} />
              <Route path="/sinh-vien" element={<DanhSachSinhVien />} />
              <Route path="/quet-qr" element={<QuetQR />} />
              <Route path="/lich-su-diem-danh" element={<LichSuDiemDanh />} />
            </Routes>
          </div>
        </header>
      </div>
    </Router>
  );
}

export default App;