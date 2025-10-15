import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import carService from '../../services/carService';
import catalogService from '../../services/catalogService';

function HomePage() {
    const [allCars, setAllCars] = useState([]);
    const [displayCars, setDisplayCars] = useState([]);
    const [catalogs, setCatalogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSeat, setSelectedSeat] = useState('');
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });

    useEffect(() => {
        Promise.all([
            fetch('http://localhost:8080/api/cars').then(res => res.json()),
            catalogService.getAllCatalogs()
        ])
            .then(([carsData, catalogsData]) => {
                const cars = carsData.cars || [];
                setAllCars(cars);
                setDisplayCars(cars);
                setCatalogs(catalogsData.data || []);
                setLoading(false);
            })
            .catch(err => {
                console.error('Lỗi:', err);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        let filtered = [...allCars];

        if (searchTerm) {
            filtered = filtered.filter(car =>
                car.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedCategory) {
            filtered = filtered.filter(car =>
                car.catalog?.idCata === parseInt(selectedCategory)
            );
        }

        if (selectedSeat) {
            filtered = filtered.filter(car =>
                car.socho === parseInt(selectedSeat)
            );
        }

        if (priceRange.min || priceRange.max) {
            filtered = filtered.filter(car => {
                const price = car.sale_price || car.price;
                const min = priceRange.min ? parseFloat(priceRange.min) : 0;
                const max = priceRange.max ? parseFloat(priceRange.max) : Infinity;
                return price >= min && price <= max;
            });
        }

        setDisplayCars(filtered);
    }, [searchTerm, selectedCategory, selectedSeat, priceRange, allCars]);

    const handleCarClick = (carId) => {
        navigate(`/car/${carId}`);
    };

    const handleResetFilters = () => {
        setSearchTerm('');
        setSelectedCategory('');
        setSelectedSeat('');
        setPriceRange({ min: '', max: '' });
    };

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
                    <div style={{ fontSize: '64px', marginBottom: '20px', animation: 'spin 2s linear infinite' }}>🚗</div>
                    <h2 style={{ fontSize: '24px', fontWeight: '300' }}>Đang tải...</h2>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
            {/* Modern Hero Header */}
            <header style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                padding: '0',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
            }}>
                <nav style={{
                    maxWidth: '1400px',
                    margin: '0 auto',
                    padding: '20px 40px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ fontSize: '32px' }}>🚗</div>
                        <div>
                            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '700', letterSpacing: '-0.5px' }}>
                                OTO SHOP
                            </h1>
                            <p style={{ margin: 0, fontSize: '12px', opacity: 0.9, fontWeight: '300' }}>
                                Premium Car Dealership
                            </p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '16px' }}>
                        <button
                            onClick={() => navigate('/contact')}
                            style={{
                                padding: '10px 24px',
                                background: 'rgba(255,255,255,0.15)',
                                backdropFilter: 'blur(10px)',
                                color: 'white',
                                border: '1px solid rgba(255,255,255,0.2)',
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontWeight: '500',
                                cursor: 'pointer',
                                transition: 'all 0.3s'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.background = 'rgba(255,255,255,0.25)';
                                e.target.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.background = 'rgba(255,255,255,0.15)';
                                e.target.style.transform = 'translateY(0)';
                            }}>
                            Liên hệ
                        </button>
                        <button
                            onClick={() => navigate('/admin/login')}
                            style={{
                                padding: '10px 24px',
                                background: 'white',
                                color: '#667eea',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)';
                            }}>
                            Admin
                        </button>
                    </div>
                </nav>

                {/* Hero Section */}
                <div style={{
                    maxWidth: '1400px',
                    margin: '0 auto',
                    padding: '60px 40px 80px',
                    textAlign: 'center'
                }}>
                    <h2 style={{
                        margin: '0 0 16px 0',
                        fontSize: '48px',
                        fontWeight: '700',
                        lineHeight: '1.2',
                        letterSpacing: '-1px'
                    }}>
                        Tìm chiếc xe hoàn hảo<br />của bạn
                    </h2>
                    <p style={{
                        margin: '0 auto 40px',
                        fontSize: '18px',
                        opacity: 0.95,
                        fontWeight: '300',
                        maxWidth: '600px',
                        lineHeight: '1.6'
                    }}>
                        Hàng trăm mẫu xe chất lượng cao với giá tốt nhất thị trường
                    </p>

                    {/* Quick Search */}
                    <div style={{
                        maxWidth: '600px',
                        margin: '0 auto',
                        background: 'white',
                        borderRadius: '12px',
                        padding: '8px',
                        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
                        display: 'flex',
                        gap: '8px'
                    }}>
                        <input
                            type="text"
                            placeholder="🔍 Tìm kiếm theo tên xe..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                flex: 1,
                                padding: '12px 16px',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '15px',
                                outline: 'none',
                                color: '#111827'
                            }}
                        />
                        <button
                            style={{
                                padding: '12px 28px',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '15px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap'
                            }}>
                            Tìm kiếm
                        </button>
                    </div>
                </div>
            </header>

            {/* Content */}
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 20px' }}>
                {/* Filters */}
                <div style={{
                    background: 'white',
                    padding: '24px',
                    borderRadius: '12px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    marginBottom: '32px'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#111827' }}>
                            Bộ lọc tìm kiếm
                        </h3>
                        <button
                            onClick={handleResetFilters}
                            style={{
                                padding: '8px 16px',
                                background: '#f3f4f6',
                                color: '#374151',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '13px',
                                fontWeight: '500',
                                cursor: 'pointer'
                            }}>
                            ↺ Đặt lại
                        </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '500', color: '#6b7280' }}>
                                Danh mục
                            </label>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '10px 12px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    outline: 'none',
                                    cursor: 'pointer',
                                    color: '#111827'
                                }}>
                                <option value="">Tất cả</option>
                                {catalogs.map(cat => (
                                    <option key={cat.idCata} value={cat.idCata}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '500', color: '#6b7280' }}>
                                Số chỗ
                            </label>
                            <select
                                value={selectedSeat}
                                onChange={(e) => setSelectedSeat(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '10px 12px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    outline: 'none',
                                    cursor: 'pointer',
                                    color: '#111827'
                                }}>
                                <option value="">Tất cả</option>
                                <option value="4">4 chỗ</option>
                                <option value="5">5 chỗ</option>
                                <option value="7">7 chỗ</option>
                                <option value="9">9 chỗ</option>
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '500', color: '#6b7280' }}>
                                Giá từ (VNĐ)
                            </label>
                            <input
                                type="number"
                                placeholder="0"
                                value={priceRange.min}
                                onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '10px 12px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    outline: 'none',
                                    color: '#111827'
                                }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '500', color: '#6b7280' }}>
                                Giá đến (VNĐ)
                            </label>
                            <input
                                type="number"
                                placeholder="Không giới hạn"
                                value={priceRange.max}
                                onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '10px 12px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    outline: 'none',
                                    color: '#111827'
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Results Info */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '24px'
                }}>
                    <h3 style={{ margin: 0, fontSize: '22px', color: '#111827', fontWeight: '600' }}>
                        Xe hiện có
                    </h3>
                    <div style={{
                        padding: '8px 16px',
                        background: 'white',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#667eea',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }}>
                        {displayCars.length} xe
                    </div>
                </div>

                {/* Cars Grid */}
                {displayCars.length === 0 ? (
                    <div style={{
                        background: 'white',
                        padding: '80px 40px',
                        borderRadius: '12px',
                        textAlign: 'center',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }}>
                        <div style={{ fontSize: '64px', marginBottom: '20px', opacity: 0.5 }}>🔍</div>
                        <h3 style={{ color: '#6b7280', fontSize: '20px', margin: '0 0 12px 0', fontWeight: '500' }}>
                            Không tìm thấy xe phù hợp
                        </h3>
                        <button
                            onClick={handleResetFilters}
                            style={{
                                marginTop: '16px',
                                padding: '10px 20px',
                                background: '#667eea',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontWeight: '500',
                                cursor: 'pointer'
                            }}>
                            Xóa bộ lọc
                        </button>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                        gap: '24px'
                    }}>
                        {displayCars.map(car => (
                            <div
                                key={car.idCar}
                                onClick={() => handleCarClick(car.idCar)}
                                style={{
                                    background: 'white',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                    transition: 'all 0.3s',
                                    cursor: 'pointer',
                                    border: '1px solid #f3f4f6'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-8px)';
                                    e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0,0,0,0.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                                }}>
                                {/* Car Image */}
                                <div style={{
                                    height: '220px',
                                    background: car.image
                                        ? `url(${car.image}) center/cover no-repeat`
                                        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'relative'
                                }}>
                                    {!car.image && (
                                        <div style={{ fontSize: '64px' }}>🚗</div>
                                    )}
                                    {car.sale_price && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '12px',
                                            right: '12px',
                                            background: '#ef4444',
                                            color: 'white',
                                            padding: '6px 12px',
                                            borderRadius: '6px',
                                            fontSize: '12px',
                                            fontWeight: '700',
                                            boxShadow: '0 2px 8px rgba(239,68,68,0.3)'
                                        }}>
                                            SALE {Math.round((1 - car.sale_price / car.price) * 100)}%
                                        </div>
                                    )}
                                </div>

                                {/* Car Info */}
                                <div style={{ padding: '20px' }}>
                                    <div style={{
                                        display: 'inline-block',
                                        padding: '4px 10px',
                                        background: '#ede9fe',
                                        color: '#7c3aed',
                                        borderRadius: '6px',
                                        fontSize: '11px',
                                        fontWeight: '600',
                                        marginBottom: '12px',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px'
                                    }}>
                                        {car.catalog?.name || 'Xe'}
                                    </div>

                                    <h3 style={{
                                        margin: '0 0 12px 0',
                                        fontSize: '18px',
                                        color: '#111827',
                                        fontWeight: '600',
                                        lineHeight: '1.4'
                                    }}>
                                        {car.name}
                                    </h3>

                                    <div style={{ marginBottom: '16px' }}>
                                        {car.sale_price ? (
                                            <>
                                                <div style={{
                                                    fontSize: '24px',
                                                    color: '#ef4444',
                                                    fontWeight: '700',
                                                    marginBottom: '4px'
                                                }}>
                                                    {car.sale_price?.toLocaleString('vi-VN')} đ
                                                </div>
                                                <div style={{
                                                    fontSize: '14px',
                                                    color: '#9ca3af',
                                                    textDecoration: 'line-through'
                                                }}>
                                                    {car.price?.toLocaleString('vi-VN')} đ
                                                </div>
                                            </>
                                        ) : (
                                            <div style={{
                                                fontSize: '24px',
                                                color: '#111827',
                                                fontWeight: '700'
                                            }}>
                                                {car.price?.toLocaleString('vi-VN')} đ
                                            </div>
                                        )}
                                    </div>

                                    <div style={{
                                        display: 'flex',
                                        gap: '8px',
                                        marginBottom: '16px',
                                        flexWrap: 'wrap'
                                    }}>
                                        {car.socho && (
                                            <span style={{
                                                padding: '4px 10px',
                                                background: '#f3f4f6',
                                                color: '#4b5563',
                                                borderRadius: '6px',
                                                fontSize: '12px',
                                                fontWeight: '500'
                                            }}>
                                                {car.socho} chỗ
                                            </span>
                                        )}
                                        {car.namsx && (
                                            <span style={{
                                                padding: '4px 10px',
                                                background: '#f3f4f6',
                                                color: '#4b5563',
                                                borderRadius: '6px',
                                                fontSize: '12px',
                                                fontWeight: '500'
                                            }}>
                                                {car.namsx}
                                            </span>
                                        )}
                                        {car.mausac && (
                                            <span style={{
                                                padding: '4px 10px',
                                                background: '#f3f4f6',
                                                color: '#4b5563',
                                                borderRadius: '6px',
                                                fontSize: '12px',
                                                fontWeight: '500'
                                            }}>
                                                {car.mausac}
                                            </span>
                                        )}
                                    </div>

                                    <button style={{
                                        width: '100%',
                                        padding: '12px',
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        transition: 'opacity 0.2s'
                                    }}>
                                        Xem chi tiết →
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            <footer style={{
                background: '#1f2937',
                color: 'white',
                padding: '40px 20px',
                marginTop: '80px'
            }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto', textAlign: 'center' }}>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: '600' }}>
                        OTO SHOP
                    </h3>
                    <p style={{ margin: '0 0 20px 0', fontSize: '14px', opacity: 0.8 }}>
                        Cửa hàng xe hơi uy tín hàng đầu Việt Nam
                    </p>
                    <div style={{ fontSize: '13px', opacity: 0.7 }}>
                        © 2025 OTO SHOP. All rights reserved.
                    </div>
                </div>
            </footer>

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}

export default HomePage;