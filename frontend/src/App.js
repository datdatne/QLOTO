import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/customer/HomePage';
import CarDetail from './pages/customer/CarDetail';
import ContactPage from './pages/customer/ContactPage';
import LoginPage from './pages/admin/LoginPage';
import Dashboard from './pages/admin/Dashboard';

function App() {
    return (
        <Router>
            <Routes>
                {/* Customer Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/car/:id" element={<CarDetail />} />
                <Route path="/contact" element={<ContactPage />} />

                {/* Admin Routes */}
                <Route path="/admin/login" element={<LoginPage />} />
                <Route path="/admin/dashboard" element={<Dashboard />} />
            </Routes>
        </Router>
    );
}

export default App;