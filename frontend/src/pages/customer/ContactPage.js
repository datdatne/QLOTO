import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import orderService from '../../services/orderService';

function ContactPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const car = location.state?.car; // Xe được chọn từ trang chi tiết

    const [formData, setFormData] = useState({
        hoten: '',
        email: '',
        phone: '',
        diachi: '',
        ghichu: ''
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const orderData = {
                hoten: formData.hoten,
                email: formData.email,
                phone: formData.phone,
                diachi: formData.diachi,
                tongdh: car ? (car.sale_price || car.price) : 0,
                donHangChiTiets: car ? [{
                    soluong: 1,
                    dongia: car.sale_price || car.price,
                    car: { idCar: car.idCar }
                }] : []
            };

            await orderService.createOrder(orderData);
            setSuccess(true);
            setLoading(false);

            // Reset form sau 3 giây
            setTimeout(() => {
                navigate('/');
            }, 3000);
        } catch (err) {
            console.error('Lỗi:', err);
            setError('Có lỗi xảy ra khi gửi đơn hàng. Vui lòng thử lại!');
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f7fa' }}>
                <div style={{
                    background: 'white',
                    padding: '60px 80px',
                    borderRadius: '16px',
                    textAlign: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}>
                    <div style={{ fontSize: '80px', marginBottom: '20px' }}>✅</div>
                    <h2 style={{ fontSize: '32px', color: '#27ae60', marginBottom: '16px' }}>
                        Đặt hàng thành công!
                    </h2>
                    <p style={{ fontSize: '18px', color: '#666', marginBottom: '30px' }}>
                        Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.
                    </p>
                    <p style={{ fontSize: '16px', color: '#999' }}>
                        Đang chuyển về trang chủ...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: '#f5f7fa' }}>
            {/* Header */}
            <header style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                padding: '20px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <button
                        onClick={() => navigate(-1)}
                        style={{
                            background: 'rgba(255,255,255,0.2)',
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '8px',
                            fontSize: '16px',
                            cursor: 'pointer'
                        }}>
                        ← Quay lại
                    </button>
                    <h1 style={{ margin: 0, fontSize: '32px' }}>Đặt hàng</h1>
                </div>
            </header>

            {/* Content */}
            <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: car ? '1fr 1fr' : '1fr', gap: '30px' }}>
                    {/* Car Info (if selected) */}
                    {car && (
                        <div style={{
                            background: 'white',
                            padding: '30px',
                            borderRadius: '16px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}>
                            <h3 style={{ fontSize: '24px', marginBottom: '20px', color: '#333' }}>
                                🚗 Thông tin xe
                            </h3>
                            <div style={{
                                height: '200px',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '64px',
                                marginBottom: '20px'
                            }}>
                                🚗
                            </div>
                            <h4 style={{ fontSize: '20px', marginBottom: '12px', color: '#333' }}>
                                {car.name}
                            </h4>
                            <p style={{ fontSize: '24px', color: '#e74c3c', fontWeight: 'bold', marginBottom: '16px' }}>
                                💰 {(car.sale_price || car.price)?.toLocaleString('vi-VN')} VNĐ
                            </p>
                            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <span style={{ background: '#f0f0f0', padding: '6px 12px', borderRadius: '20px', fontSize: '14px' }}>
                  🪑 {car.socho} chỗ
                </span>
                                <span style={{ background: '#f0f0f0', padding: '6px 12px', borderRadius: '20px', fontSize: '14px' }}>
                  📅 {car.namsx}
                </span>
                                <span style={{ background: '#f0f0f0', padding: '6px 12px', borderRadius: '20px', fontSize: '14px' }}>
                  🎨 {car.mausac}
                </span>
                            </div>
                        </div>
                    )}

                    {/* Form */}
                    <div style={{
                        background: 'white',
                        padding: '30px',
                        borderRadius: '16px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}>
                        <h3 style={{ fontSize: '24px', marginBottom: '20px', color: '#333' }}>
                            📝 Thông tin liên hệ
                        </h3>

                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '15px', fontWeight: 'bold', color: '#555' }}>
                                    Họ và tên *
                                </label>
                                <input
                                    type="text"
                                    name="hoten"
                                    required
                                    value={formData.hoten}
                                    onChange={handleChange}
                                    placeholder="Nguyễn Văn A"
                                    style={{
                                        width: '100%',
                                        padding: '14px',
                                        border: '2px solid #e0e0e0',
                                        borderRadius: '8px',
                                        fontSize: '15px',
                                        outline: 'none',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '15px', fontWeight: 'bold', color: '#555' }}>
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="example@gmail.com"
                                    style={{
                                        width: '100%',
                                        padding: '14px',
                                        border: '2px solid #e0e0e0',
                                        borderRadius: '8px',
                                        fontSize: '15px',
                                        outline: 'none',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '15px', fontWeight: 'bold', color: '#555' }}>
                                    Số điện thoại *
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    required
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="0123456789"
                                    style={{
                                        width: '100%',
                                        padding: '14px',
                                        border: '2px solid #e0e0e0',
                                        borderRadius: '8px',
                                        fontSize: '15px',
                                        outline: 'none',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '15px', fontWeight: 'bold', color: '#555' }}>
                                    Địa chỉ *
                                </label>
                                <input
                                    type="text"
                                    name="diachi"
                                    required
                                    value={formData.diachi}
                                    onChange={handleChange}
                                    placeholder="Hà Nội"
                                    style={{
                                        width: '100%',
                                        padding: '14px',
                                        border: '2px solid #e0e0e0',
                                        borderRadius: '8px',
                                        fontSize: '15px',
                                        outline: 'none',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: '30px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '15px', fontWeight: 'bold', color: '#555' }}>
                                    Ghi chú
                                </label>
                                <textarea
                                    name="ghichu"
                                    value={formData.ghichu}
                                    onChange={handleChange}
                                    placeholder="Thời gian thuận tiện để liên hệ..."
                                    rows="4"
                                    style={{
                                        width: '100%',
                                        padding: '14px',
                                        border: '2px solid #e0e0e0',
                                        borderRadius: '8px',
                                        fontSize: '15px',
                                        outline: 'none',
                                        resize: 'vertical',
                                        boxSizing: 'border-box',
                                        fontFamily: 'Arial'
                                    }}
                                />
                            </div>

                            {error && (
                                <div style={{
                                    padding: '12px',
                                    background: '#fee',
                                    color: '#c33',
                                    borderRadius: '8px',
                                    marginBottom: '20px',
                                    fontSize: '15px'
                                }}>
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    width: '100%',
                                    padding: '16px',
                                    background: loading ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '18px',
                                    fontWeight: 'bold',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    transition: 'opacity 0.3s'
                                }}>
                                {loading ? '⏳ Đang gửi...' : '📤 Gửi đơn đặt hàng'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ContactPage;