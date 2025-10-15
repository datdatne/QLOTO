import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import orderService from '../../services/orderService';
import authService from '../../services/authService';

function OrderManagement() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // State cho modal chi tiết đơn hàng
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    // State cho delete confirm
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    // Alert
    const [alert, setAlert] = useState({ show: false, type: '', message: '' });

    // Kiểm tra đăng nhập
    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        if (!currentUser || currentUser.vaitro !== 'ADMIN') {
            navigate('/admin/login');
            return;
        }
        loadOrders();
    }, [navigate]);

    // Load danh sách đơn hàng
    const loadOrders = async () => {
        try {
            const response = await orderService.getAllOrders();
            console.log('Response:', response);
            console.log('Response.data:', response.data);
            console.log('Type:', typeof response.data);

            let orderList = [];

            // Nếu response.data là STRING → parse JSON
            if (typeof response.data === 'string') {
                try {
                    orderList = JSON.parse(response.data);
                } catch (parseError) {
                    console.error('Lỗi parse JSON:', parseError);
                    orderList = [];
                }
            }
            // Nếu đã là array
            else if (Array.isArray(response.data)) {
                orderList = response.data;
            }
            // Nếu là object có thuộc tính orders
            else if (response.data && Array.isArray(response.data.orders)) {
                orderList = response.data.orders;
            }

            console.log('Final orderList:', orderList);
            console.log('Is Array?', Array.isArray(orderList));

            setOrders(Array.isArray(orderList) ? orderList : []);
            setLoading(false);
        } catch (error) {
            console.error('Lỗi khi tải đơn hàng:', error);
            showAlert('error', 'Không thể tải danh sách đơn hàng!');
            setOrders([]);
            setLoading(false);
        }
    };

    // Hiển thị alert
    const showAlert = (type, message) => {
        setAlert({ show: true, type, message });
        setTimeout(() => setAlert({ show: false, type: '', message: '' }), 3000);
    };

    // Xem chi tiết đơn hàng
    const handleViewDetail = (order) => {
        setSelectedOrder(order);
        setShowDetailModal(true);
    };

    // Mở confirm xóa
    const handleDeleteClick = (id) => {
        setDeleteId(id);
        setShowDeleteConfirm(true);
    };

    // Xử lý xóa đơn hàng
    const handleDelete = async () => {
        try {
            await orderService.deleteOrder(deleteId);
            showAlert('success', 'Xóa đơn hàng thành công! ✅');
            setShowDeleteConfirm(false);
            loadOrders();
        } catch (error) {
            console.error('Lỗi khi xóa:', error);
            showAlert('error', 'Không thể xóa đơn hàng này!');
            setShowDeleteConfirm(false);
        }
    };

    // Format ngày giờ
    const formatDateTime = (timestamp) => {
        if (!timestamp) return '-';
        try {
            const date = new Date(timestamp);
            return date.toLocaleString('vi-VN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            return '-';
        }
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f7fa' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '48px', marginBottom: '20px' }}>📦</div>
                    <h2 style={{ color: '#667eea' }}>Đang tải dữ liệu...</h2>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: '#f5f7fa' }}>
            {/* Header */}
            <header style={{
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: 'white',
                padding: '20px 40px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <button
                        onClick={() => navigate('/admin/dashboard')}
                        style={{
                            background: 'rgba(255,255,255,0.2)',
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '8px',
                            fontSize: '16px',
                            cursor: 'pointer',
                            transition: 'background 0.3s'
                        }}
                        onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
                        onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}>
                        ← Quay lại
                    </button>
                    <h1 style={{ margin: 0, fontSize: '28px' }}>📦 Quản lý Đơn hàng</h1>
                </div>
            </header>

            {/* Alert */}
            {alert.show && (
                <div style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    padding: '16px 24px',
                    background: alert.type === 'success' ? '#d4edda' : '#f8d7da',
                    color: alert.type === 'success' ? '#155724' : '#721c24',
                    border: `1px solid ${alert.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    zIndex: 1000,
                    fontSize: '16px',
                    fontWeight: 'bold'
                }}>
                    {alert.message}
                </div>
            )}

            {/* Content */}
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 20px' }}>
                {/* Header */}
                <div style={{ marginBottom: '30px' }}>
                    <h2 style={{ margin: 0, fontSize: '24px', color: '#333' }}>
                        Danh sách đơn hàng ({Array.isArray(orders) ? orders.length : 0})
                    </h2>
                </div>

                {/* Table */}
                {!Array.isArray(orders) || orders.length === 0 ? (
                    <div style={{
                        background: 'white',
                        padding: '80px',
                        borderRadius: '16px',
                        textAlign: 'center',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}>
                        <div style={{ fontSize: '64px', marginBottom: '20px' }}>📦</div>
                        <h3 style={{ color: '#999', fontSize: '20px' }}>
                            {!Array.isArray(orders) ? 'Đang tải...' : 'Chưa có đơn hàng nào'}
                        </h3>
                    </div>
                ) : (
                    <div style={{
                        background: 'white',
                        borderRadius: '16px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        overflow: 'hidden'
                    }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                            <tr style={{ background: '#f8f9fa' }}>
                                <th style={{ padding: '16px', textAlign: 'left', fontWeight: 'bold', color: '#555', borderBottom: '2px solid #e0e0e0' }}>
                                    ID
                                </th>
                                <th style={{ padding: '16px', textAlign: 'left', fontWeight: 'bold', color: '#555', borderBottom: '2px solid #e0e0e0' }}>
                                    Khách hàng
                                </th>
                                <th style={{ padding: '16px', textAlign: 'left', fontWeight: 'bold', color: '#555', borderBottom: '2px solid #e0e0e0' }}>
                                    Số điện thoại
                                </th>
                                <th style={{ padding: '16px', textAlign: 'left', fontWeight: 'bold', color: '#555', borderBottom: '2px solid #e0e0e0' }}>
                                    Tổng tiền
                                </th>
                                <th style={{ padding: '16px', textAlign: 'left', fontWeight: 'bold', color: '#555', borderBottom: '2px solid #e0e0e0' }}>
                                    Ngày đặt
                                </th>
                                <th style={{ padding: '16px', textAlign: 'center', fontWeight: 'bold', color: '#555', borderBottom: '2px solid #e0e0e0', width: '200px' }}>
                                    Thao tác
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {orders.map((order) => (
                                <tr key={order.idDh} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                    <td style={{ padding: '16px', color: '#666' }}>
                                        #{order.idDh}
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ fontWeight: 'bold', color: '#333', marginBottom: '4px' }}>
                                            {order.hoten || '-'}
                                        </div>
                                        <div style={{ fontSize: '13px', color: '#999' }}>
                                            {order.email || '-'}
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px', color: '#666' }}>
                                        {order.phone || '-'}
                                    </td>
                                    <td style={{ padding: '16px', fontWeight: 'bold', color: '#e74c3c' }}>
                                        {order.tongdh ? order.tongdh.toLocaleString('vi-VN') : '0'} đ
                                    </td>
                                    <td style={{ padding: '16px', color: '#666', fontSize: '14px' }}>
                                        {formatDateTime(order.ngayDatHang)}
                                    </td>
                                    <td style={{ padding: '16px', textAlign: 'center' }}>
                                        <button
                                            onClick={() => handleViewDetail(order)}
                                            style={{
                                                padding: '8px 16px',
                                                background: '#3498db',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '6px',
                                                fontSize: '14px',
                                                cursor: 'pointer',
                                                marginRight: '8px',
                                                transition: 'opacity 0.3s'
                                            }}
                                            onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                                            onMouseLeave={(e) => e.target.style.opacity = '1'}>
                                            👁️ Chi tiết
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(order.idDh)}
                                            style={{
                                                padding: '8px 16px',
                                                background: '#e74c3c',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '6px',
                                                fontSize: '14px',
                                                cursor: 'pointer',
                                                transition: 'opacity 0.3s'
                                            }}
                                            onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                                            onMouseLeave={(e) => e.target.style.opacity = '1'}>
                                            🗑️ Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal Chi tiết đơn hàng */}
            {showDetailModal && selectedOrder && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '20px',
                    overflowY: 'auto'
                }}>
                    <div style={{
                        background: 'white',
                        padding: '40px',
                        borderRadius: '16px',
                        width: '90%',
                        maxWidth: '700px',
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
                    }}>
                        <h2 style={{ margin: '0 0 30px 0', fontSize: '24px', color: '#333' }}>
                            📦 Chi tiết đơn hàng #{selectedOrder.idDh}
                        </h2>

                        {/* Thông tin khách hàng */}
                        <div style={{ marginBottom: '30px', padding: '20px', background: '#f8f9fa', borderRadius: '12px' }}>
                            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#333' }}>
                                👤 Thông tin khách hàng
                            </h3>
                            <div style={{ display: 'grid', gap: '12px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: '#666', fontWeight: 'bold' }}>Họ tên:</span>
                                    <span style={{ color: '#333' }}>{selectedOrder.hoten || '-'}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: '#666', fontWeight: 'bold' }}>Email:</span>
                                    <span style={{ color: '#333' }}>{selectedOrder.email || '-'}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: '#666', fontWeight: 'bold' }}>Số điện thoại:</span>
                                    <span style={{ color: '#333' }}>{selectedOrder.phone || '-'}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: '#666', fontWeight: 'bold' }}>Địa chỉ:</span>
                                    <span style={{ color: '#333', textAlign: 'right', maxWidth: '60%' }}>
                                        {selectedOrder.diachi || '-'}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: '#666', fontWeight: 'bold' }}>Ngày đặt:</span>
                                    <span style={{ color: '#333' }}>
                                        {formatDateTime(selectedOrder.ngayDatHang)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Chi tiết sản phẩm */}
                        <div style={{ marginBottom: '30px' }}>
                            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#333' }}>
                                🚗 Sản phẩm trong đơn
                            </h3>
                            {selectedOrder.donHangChiTiets && Array.isArray(selectedOrder.donHangChiTiets) && selectedOrder.donHangChiTiets.length > 0 ? (
                                <div style={{ border: '1px solid #e0e0e0', borderRadius: '12px', overflow: 'hidden' }}>
                                    {selectedOrder.donHangChiTiets.map((item, index) => (
                                        <div
                                            key={index}
                                            style={{
                                                padding: '16px',
                                                borderBottom: index < selectedOrder.donHangChiTiets.length - 1 ? '1px solid #e0e0e0' : 'none',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }}>
                                            <div>
                                                <div style={{ fontWeight: 'bold', color: '#333', marginBottom: '4px' }}>
                                                    {item.car?.name || 'Xe không xác định'}
                                                </div>
                                                <div style={{ fontSize: '14px', color: '#666' }}>
                                                    Số lượng: {item.soluong || 1} | Đơn giá: {(item.dongia || 0).toLocaleString('vi-VN')} đ
                                                </div>
                                            </div>
                                            <div style={{ fontWeight: 'bold', color: '#e74c3c', fontSize: '16px' }}>
                                                {((item.soluong || 1) * (item.dongia || 0)).toLocaleString('vi-VN')} đ
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p style={{ color: '#999', fontStyle: 'italic' }}>Không có sản phẩm</p>
                            )}
                        </div>

                        {/* Tổng tiền */}
                        <div style={{
                            padding: '20px',
                            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                            borderRadius: '12px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '30px'
                        }}>
                            <span style={{ fontSize: '18px', fontWeight: 'bold', color: 'white' }}>
                                TỔNG CỘNG:
                            </span>
                            <span style={{ fontSize: '24px', fontWeight: 'bold', color: 'white' }}>
                                {(selectedOrder.tongdh || 0).toLocaleString('vi-VN')} đ
                            </span>
                        </div>

                        {/* Close button */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => setShowDetailModal(false)}
                                style={{
                                    padding: '12px 24px',
                                    background: '#667eea',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer'
                                }}>
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirm Modal */}
            {showDeleteConfirm && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        background: 'white',
                        padding: '40px',
                        borderRadius: '16px',
                        width: '90%',
                        maxWidth: '400px',
                        textAlign: 'center',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
                    }}>
                        <div style={{ fontSize: '64px', marginBottom: '20px' }}>⚠️</div>
                        <h3 style={{ margin: '0 0 16px 0', fontSize: '20px', color: '#333' }}>
                            Xác nhận xóa đơn hàng
                        </h3>
                        <p style={{ margin: '0 0 30px 0', fontSize: '16px', color: '#666' }}>
                            Bạn có chắc chắn muốn xóa đơn hàng này không?<br />
                            Hành động này không thể hoàn tác!
                        </p>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                style={{
                                    padding: '12px 24px',
                                    background: '#e0e0e0',
                                    color: '#555',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer'
                                }}>
                                Hủy
                            </button>
                            <button
                                onClick={handleDelete}
                                style={{
                                    padding: '12px 24px',
                                    background: '#e74c3c',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer'
                                }}>
                                🗑️ Xóa
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default OrderManagement;