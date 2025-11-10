import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function CarDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`http://localhost:8080/api/cars/${id}`)
            .then(response => response.json())
            .then(data => {
                setCar(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Lỗi:', err);
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}>
                <div style={{ textAlign: 'center', color: 'white' }}>
                    <div style={{ fontSize: '48px', marginBottom: '20px' }}>🚗</div>
                    <h2>Đang tải thông tin xe...</h2>
                </div>
            </div>
        );
    }

    if (!car) {
        return (
            <div style={{ padding: '50px', textAlign: 'center' }}>
                <h1>❌ Không tìm thấy xe</h1>
                <button
                    onClick={() => navigate('/')}
                    style={{
                        padding: '12px 24px',
                        background: '#667eea',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '16px',
                        cursor: 'pointer',
                        marginTop: '20px'
                    }}>
                    ← Quay lại trang chủ
                </button>
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
                        onClick={() => navigate('/')}
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
                    <h1 style={{ margin: 0, fontSize: '32px' }}>Chi tiết xe</h1>
                </div>
            </header>

            {/* Content */}
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
                <div style={{
                    background: 'white',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0' }}>
                        {/* Image Section - ĐÃ SỬA */}
                        <div style={{
                            height: '500px',
                            background: '#f5f7fa',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden'
                        }}>
                            {car.image ? (
                                <img
                                    src={car.image}
                                    alt={car.name}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        const placeholder = document.createElement('div');
                                        placeholder.style.cssText = 'width: 100%; height: 100%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; font-size: 120px;';
                                        placeholder.innerHTML = '🚗';
                                        e.target.parentElement.appendChild(placeholder);
                                    }}
                                />
                            ) : (
                                <div style={{
                                    width: '100%',
                                    height: '100%',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '120px'
                                }}>
                                    🚗
                                </div>
                            )}
                        </div>

                        {/* Info Section */}
                        <div style={{ padding: '40px' }}>
                            <h2 style={{ margin: '0 0 20px 0', fontSize: '32px', color: '#333' }}>
                                {car.name}
                            </h2>

                            {/* Price */}
                            <div style={{ marginBottom: '30px' }}>
                                {car.sale_price ? (
                                    <>
                                        <div style={{
                                            fontSize: '36px',
                                            color: '#e74c3c',
                                            fontWeight: 'bold',
                                            marginBottom: '8px'
                                        }}>
                                            💰 {car.sale_price?.toLocaleString('vi-VN')} VNĐ
                                        </div>
                                        <div style={{
                                            fontSize: '20px',
                                            color: '#999',
                                            textDecoration: 'line-through'
                                        }}>
                                            Giá gốc: {car.price?.toLocaleString('vi-VN')} VNĐ
                                        </div>
                                        <div style={{
                                            display: 'inline-block',
                                            background: '#e74c3c',
                                            color: 'white',
                                            padding: '6px 12px',
                                            borderRadius: '20px',
                                            fontSize: '14px',
                                            fontWeight: 'bold',
                                            marginTop: '8px'
                                        }}>
                                            🔥 Giảm {Math.round((1 - car.sale_price / car.price) * 100)}%
                                        </div>
                                    </>
                                ) : (
                                    <div style={{
                                        fontSize: '36px',
                                        color: '#667eea',
                                        fontWeight: 'bold'
                                    }}>
                                        💰 {car.price?.toLocaleString('vi-VN')} VNĐ
                                    </div>
                                )}
                            </div>

                            {/* Specs */}
                            <div style={{ marginBottom: '30px' }}>
                                <h3 style={{ fontSize: '20px', marginBottom: '16px', color: '#333' }}>
                                    Thông số kỹ thuật:
                                </h3>
                                <div style={{ display: 'grid', gap: '12px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#f8f9fa', borderRadius: '8px' }}>
                                        <span style={{ fontWeight: 'bold', color: '#666' }}>🪑 Số chỗ:</span>
                                        <span style={{ color: '#333' }}>{car.socho} chỗ</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#f8f9fa', borderRadius: '8px' }}>
                                        <span style={{ fontWeight: 'bold', color: '#666' }}>📅 Năm sản xuất:</span>
                                        <span style={{ color: '#333' }}>{car.namsx}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#f8f9fa', borderRadius: '8px' }}>
                                        <span style={{ fontWeight: 'bold', color: '#666' }}>⚙️ Động cơ:</span>
                                        <span style={{ color: '#333' }}>{car.dongco}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#f8f9fa', borderRadius: '8px' }}>
                                        <span style={{ fontWeight: 'bold', color: '#666' }}>🔧 Hộp số:</span>
                                        <span style={{ color: '#333' }}>{car.hopso}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#f8f9fa', borderRadius: '8px' }}>
                                        <span style={{ fontWeight: 'bold', color: '#666' }}>🎨 Màu sắc:</span>
                                        <span style={{ color: '#333' }}>{car.mausac}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#f8f9fa', borderRadius: '8px' }}>
                                        <span style={{ fontWeight: 'bold', color: '#666' }}>✨ Tình trạng:</span>
                                        <span style={{ color: '#333' }}>{car.tinhtrang}</span>
                                    </div>
                                </div>
                            </div>


                            <button
                                onClick={() => navigate('/contact', { state: { car } })}
                                style={{
                                    width: '100%',
                                    padding: '18px',
                                    background: '#27ae60',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontSize: '18px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    transition: 'opacity 0.3s'
                                }}
                                onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                                onMouseLeave={(e) => e.target.style.opacity = '1'}>
                                🛒 Đặt hàng ngay
                            </button>
                        </div>
                    </div>

                    {/* Description */}
                    {car.mota && (
                        <div style={{ padding: '40px', borderTop: '1px solid #eee' }}>
                            <h3 style={{ fontSize: '24px', marginBottom: '16px', color: '#333' }}>
                                📝 Mô tả chi tiết:
                            </h3>
                            <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#666' }}>
                                {car.mota}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CarDetail;