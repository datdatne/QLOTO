import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/customer/HomePage';
import CarDetail from './pages/customer/CarDetail';
import ContactPage from './pages/customer/ContactPage';
import LoginPage from './pages/admin/LoginPage';
import Dashboard from './pages/admin/Dashboard';
import CatalogManagement from './pages/admin/CatalogManagement';
import CarManagement from './pages/admin/CarManagement';
import OrderManagement from './pages/admin/OrderManagement';
function App() {
    return (
        <Router>
            <Routes>
                {/* Customer Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/car/:id" element={<CarDetail />} />
                <Route path="/contact" element={<ContactPage />} />

                {/* Admin Routes đăng nhập và dashboard */}
                <Route path="/admin/login" element={<LoginPage />} />
                <Route path="/admin/dashboard" element={<Dashboard />} />
                {/*Admin danh mục chi tiết và quản lí xe */}
                <Route path="/admin/catalogs" element={<CatalogManagement />} />
                <Route path="/admin/cars" element={<CarManagement />} />
                <Route path="/admin/orders" element={<OrderManagement />} />
            </Routes>
        </Router>
    );
}

export default App;