import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState({
        totalCars: 0,
        totalOrders: 0,
        totalCatalogs: 0,
        totalCarsSold: 0 // ← THÊM THỐNG KÊ MỚI
    });

    useEffect(() => {
        // Kiểm tra đăng nhập
        const currentUser = authService.getCurrentUser();
        if (!currentUser || currentUser.vaitro !== 'ADMIN') {
            navigate('/admin/login');
            return;
        }
        setUser(currentUser);

        // Load thống kê
        Promise.all([
            fetch('http://localhost:8080/api/cars').then(res => res.json()),
            fetch('http://localhost:8080/api/orders').then(res => res.json()),
            fetch('http://localhost:8080/api/catalogs').then(res => res.json()),
            fetch('http://localhost:8080/api/statistics/total-cars-sold').then(res => res.json()) // ← API MỚI
        ])
            .then(([carsData, ordersData, catalogsData, soldData]) => {
                setStats({
                    totalCars: (carsData.cars || carsData || []).length,
                    totalOrders: (ordersData || []).length,
                    totalCatalogs: (catalogsData || []).length,
                    totalCarsSold: soldData.totalCarsSold || 0 // ← DỮ LIỆU MỚI
                });
            })
            .catch(err => console.error('Lỗi:', err));
    }, [navigate]);

    const handleLogout = () => {
        authService.logout();
        navigate('/admin/login');
    };

    if (!user) {
        return <div style={{ padding: '50px', textAlign: 'center' }}>Đang tải...</div>;
    }

    return (
        <div style={{ minHeight: '100vh', background: '#f5f7fa' }}>
            {/* Header */}
            <header style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                padding: '20px 40px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '28px' }}>👨‍💼 Admin Dashboard</h1>
                    <p style={{ margin: '5px 0 0 0', fontSize: '14px', opacity: 0.9 }}>
                        Xin chào, <strong>{user.hoten || user.username}</strong>
                    </p>
                </div>
                <button
                    onClick={handleLogout}
                    style={{
                        padding: '12px 24px',
                        background: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        border: '2px solid white',
                        borderRadius: '8px',
                        fontSize: '16px',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        fontWeight: 'bold'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.background = 'white';
                        e.target.style.color = '#667eea';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.background = 'rgba(255,255,255,0.2)';
                        e.target.style.color = 'white';
                    }}>
                    🚪 Đăng xuất
                </button>
            </header>

            {/* Content */}
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 20px' }}>
                {/* Stats Cards */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '30px',
                    marginBottom: '40px'
                }}>
                    {/* Total Cars */}
                    <div style={{
                        background: 'white',
                        padding: '30px',
                        borderRadius: '16px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px'
                    }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '16px',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '36px'
                        }}>
                            🚗
                        </div>
                        <div>
                            <p style={{ margin: 0, fontSize: '16px', color: '#999' }}>Tổng số xe</p>
                            <h2 style={{ margin: '8px 0 0 0', fontSize: '42px', color: '#333' }}>
                                {stats.totalCars}
                            </h2>
                        </div>
                    </div>

                    {/* Total Cars Sold - THỐNG KÊ MỚI */}
                    <div style={{
                        background: 'white',
                        padding: '30px',
                        borderRadius: '16px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px'
                    }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '16px',
                            background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '36px'
                        }}>
                            ✅
                        </div>
                        <div>
                            <p style={{ margin: 0, fontSize: '16px', color: '#999' }}>Xe đã bán</p>
                            <h2 style={{ margin: '8px 0 0 0', fontSize: '42px', color: '#333' }}>
                                {stats.totalCarsSold}
                            </h2>
                        </div>
                    </div>

                    {/* Total Orders */}
                    <div style={{
                        background: 'white',
                        padding: '30px',
                        borderRadius: '16px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px'
                    }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '16px',
                            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '36px'
                        }}>
                            📦
                        </div>
                        <div>
                            <p style={{ margin: 0, fontSize: '16px', color: '#999' }}>Tổng đơn hàng</p>
                            <h2 style={{ margin: '8px 0 0 0', fontSize: '42px', color: '#333' }}>
                                {stats.totalOrders}
                            </h2>
                        </div>
                    </div>

                    {/* Total Catalogs */}
                    <div style={{
                        background: 'white',
                        padding: '30px',
                        borderRadius: '16px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px'
                    }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '16px',
                            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '36px'
                        }}>
                            📂
                        </div>
                        <div>
                            <p style={{ margin: 0, fontSize: '16px', color: '#999' }}>Tổng danh mục</p>
                            <h2 style={{ margin: '8px 0 0 0', fontSize: '42px', color: '#333' }}>
                                {stats.totalCatalogs}
                            </h2>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div style={{
                    background: 'white',
                    padding: '30px',
                    borderRadius: '16px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    marginBottom: '30px'
                }}>
                    <h3 style={{ margin: '0 0 25px 0', fontSize: '24px', color: '#333' }}>
                        ⚡ Thao tác nhanh
                    </h3>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '20px'
                    }}>
                        {/* Quản lý xe */}
                        <button
                            onClick={() => navigate('/admin/cars')}
                            style={{
                                padding: '25px',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                fontSize: '18px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                transition: 'transform 0.3s',
                                textAlign: 'left'
                            }}
                            onMouseEnter={(e) => e.target.style.transform = 'translateY(-4px)'}
                            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}>
                            <div style={{ fontSize: '32px', marginBottom: '10px' }}>🚗</div>
                            <div>Quản lý xe</div>
                            <div style={{ fontSize: '14px', opacity: 0.9, marginTop: '5px' }}>
                                Thêm, sửa, xóa xe
                            </div>
                        </button>

                        {/* Quản lý đơn hàng */}
                        <button
                            onClick={() => navigate('/admin/orders')}
                            style={{
                                padding: '25px',
                                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                fontSize: '18px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                transition: 'transform 0.3s',
                                textAlign: 'left'
                            }}
                            onMouseEnter={(e) => e.target.style.transform = 'translateY(-4px)'}
                            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}>
                            <div style={{ fontSize: '32px', marginBottom: '10px' }}>📦</div>
                            <div>Quản lý đơn hàng</div>
                            <div style={{ fontSize: '14px', opacity: 0.9, marginTop: '5px' }}>
                                Xem đơn hàng
                            </div>
                        </button>

                        {/* Quản lý danh mục */}
                        <button
                            onClick={() => navigate('/admin/catalogs')}
                            style={{
                                padding: '25px',
                                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                fontSize: '18px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                transition: 'transform 0.3s',
                                textAlign: 'left'
                            }}
                            onMouseEnter={(e) => e.target.style.transform = 'translateY(-4px)'}
                            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}>
                            <div style={{ fontSize: '32px', marginBottom: '10px' }}>📂</div>
                            <div>Quản lý danh mục</div>
                            <div style={{ fontSize: '14px', opacity: 0.9, marginTop: '5px' }}>
                                Thêm, sửa danh mục
                            </div>
                        </button>

                        {/* Về trang chủ */}
                        <button
                            onClick={() => navigate('/')}
                            style={{
                                padding: '25px',
                                background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                                color: '#333',
                                border: 'none',
                                borderRadius: '12px',
                                fontSize: '18px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                transition: 'transform 0.3s',
                                textAlign: 'left'
                            }}
                            onMouseEnter={(e) => e.target.style.transform = 'translateY(-4px)'}
                            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}>
                            <div style={{ fontSize: '32px', marginBottom: '10px' }}>🏠</div>
                            <div>Về trang chủ</div>
                            <div style={{ fontSize: '14px', opacity: 0.7, marginTop: '5px' }}>
                                Xem trang khách hàng
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;