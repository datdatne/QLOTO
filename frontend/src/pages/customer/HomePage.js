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

    // Filters state
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSeat, setSelectedSeat] = useState('');
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });

    useEffect(() => {
        // Load cars and catalogs
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

    // Apply filters
    useEffect(() => {
        let filtered = [...allCars];

        // Search by name
        if (searchTerm) {
            filtered = filtered.filter(car =>
                car.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by category
        if (selectedCategory) {
            filtered = filtered.filter(car =>
                car.catalog?.idCata === parseInt(selectedCategory)
            );
        }

        // Filter by seat
        if (selectedSeat) {
            filtered = filtered.filter(car =>
                car.socho === parseInt(selectedSeat)
            );
        }

        // Filter by price range
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
                    <div style={{ fontSize: '48px', marginBottom: '20px' }}>🚗</div>
                    <h2>Đang tải dữ liệu...</h2>
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
                padding: '30px 20px',
                textAlign: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}>
                <h1 style={{ margin: 0, fontSize: '42px', fontWeight: 'bold' }}>
                    🚗 OTO SHOP
                </h1>
                <p style={{ margin: '10px 0 0 0', fontSize: '18px', opacity: 0.9 }}>
                    Cửa hàng xe hơi uy tín hàng đầu Việt Nam
                </p>
            </header>

            {/* Content */}
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 20px' }}>
                {/* Filters */}
                <div style={{
                    background: 'white',
                    padding: '30px',
                    borderRadius: '16px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    marginBottom: '30px'
                }}>
                    <h3 style={{ margin: '0 0 20px 0', fontSize: '20px', color: '#333' }}>
                        🔍 Tìm kiếm & Lọc xe
                    </h3>

                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                        {/* Search */}
                        <input
                            type="text"
                            placeholder="🔍 Tìm kiếm theo tên xe..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                padding: '12px 16px',
                                border: '2px solid #e0e0e0',
                                borderRadius: '8px',
                                fontSize: '15px',
                                outline: 'none',
                                transition: 'border 0.3s'
                            }}
                            onFocus={(e) => e.target.style.border = '2px solid #667eea'}
                            onBlur={(e) => e.target.style.border = '2px solid #e0e0e0'}
                        />

                        {/* Category Filter */}
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            style={{
                                padding: '12px 16px',
                                border: '2px solid #e0e0e0',
                                borderRadius: '8px',
                                fontSize: '15px',
                                outline: 'none',
                                cursor: 'pointer'
                            }}>
                            <option value="">📂 Tất cả danh mục</option>
                            {catalogs.map(cat => (
                                <option key={cat.idCata} value={cat.idCata}>{cat.name}</option>
                            ))}
                        </select>

                        {/* Seat Filter */}
                        <select
                            value={selectedSeat}
                            onChange={(e) => setSelectedSeat(e.target.value)}
                            style={{
                                padding: '12px 16px',
                                border: '2px solid #e0e0e0',
                                borderRadius: '8px',
                                fontSize: '15px',
                                outline: 'none',
                                cursor: 'pointer'
                            }}>
                            <option value="">🪑 Số chỗ</option>
                            <option value="4">4 chỗ</option>
                            <option value="5">5 chỗ</option>
                            <option value="7">7 chỗ</option>
                            <option value="9">9 chỗ</option>
                        </select>

                        {/* Reset Button */}
                        <button
                            onClick={handleResetFilters}
                            style={{
                                padding: '12px 16px',
                                background: '#e74c3c',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '15px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                transition: 'opacity 0.3s'
                            }}
                            onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                            onMouseLeave={(e) => e.target.style.opacity = '1'}>
                            ↺ Đặt lại
                        </button>
                    </div>

                    {/* Price Range */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <input
                            type="number"
                            placeholder="💰 Giá tối thiểu (VNĐ)"
                            value={priceRange.min}
                            onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                            style={{
                                padding: '12px 16px',
                                border: '2px solid #e0e0e0',
                                borderRadius: '8px',
                                fontSize: '15px',
                                outline: 'none'
                            }}
                        />
                        <input
                            type="number"
                            placeholder="💰 Giá tối đa (VNĐ)"
                            value={priceRange.max}
                            onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                            style={{
                                padding: '12px 16px',
                                border: '2px solid #e0e0e0',
                                borderRadius: '8px',
                                fontSize: '15px',
                                outline: 'none'
                            }}
                        />
                    </div>
                </div>

                {/* Results Info */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '30px'
                }}>
                    <h2 style={{ margin: 0, fontSize: '28px', color: '#333' }}>
                        Kết quả tìm kiếm
                    </h2>
                    <div style={{
                        background: 'white',
                        padding: '12px 24px',
                        borderRadius: '25px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        color: '#667eea'
                    }}>
                        {displayCars.length} xe
                    </div>
                </div>

                {/* Cars Grid */}
                {displayCars.length === 0 ? (
                    <div style={{
                        background: 'white',
                        padding: '80px 40px',
                        borderRadius: '16px',
                        textAlign: 'center',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}>
                        <div style={{ fontSize: '64px', marginBottom: '20px' }}>😔</div>
                        <h3 style={{ color: '#666', fontSize: '24px' }}>
                            Không tìm thấy xe phù hợp
                        </h3>
                        <button
                            onClick={handleResetFilters}
                            style={{
                                marginTop: '20px',
                                padding: '12px 24px',
                                background: '#667eea',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '16px',
                                cursor: 'pointer'
                            }}>
                            Xóa bộ lọc
                        </button>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                        gap: '30px'
                    }}>
                        {displayCars.map(car => (
                            <div
                                key={car.idCar}
                                onClick={() => handleCarClick(car.idCar)}
                                style={{
                                    background: 'white',
                                    borderRadius: '16px',
                                    overflow: 'hidden',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                    transition: 'transform 0.3s, box-shadow 0.3s',
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-8px)';
                                    e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.2)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                                }}>
                                <div style={{
                                    height: '200px',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '64px'
                                }}>
                                    🚗
                                </div>

                                <div style={{ padding: '24px' }}>
                                    <h3 style={{
                                        margin: '0 0 12px 0',
                                        fontSize: '22px',
                                        color: '#333',
                                        fontWeight: 'bold'
                                    }}>
                                        {car.name}
                                    </h3>

                                    <div style={{ marginBottom: '16px' }}>
                                        {car.sale_price ? (
                                            <>
                                                <div style={{
                                                    fontSize: '24px',
                                                    color: '#e74c3c',
                                                    fontWeight: 'bold',
                                                    marginBottom: '4px'
                                                }}>
                                                    💰 {car.sale_price?.toLocaleString('vi-VN')} VNĐ
                                                </div>
                                                <div style={{
                                                    fontSize: '16px',
                                                    color: '#999',
                                                    textDecoration: 'line-through'
                                                }}>
                                                    {car.price?.toLocaleString('vi-VN')} VNĐ
                                                </div>
                                            </>
                                        ) : (
                                            <div style={{
                                                fontSize: '24px',
                                                color: '#667eea',
                                                fontWeight: 'bold'
                                            }}>
                                                💰 {car.price?.toLocaleString('vi-VN')} VNĐ
                                            </div>
                                        )}
                                    </div>

                                    <div style={{
                                        display: 'flex',
                                        gap: '12px',
                                        marginBottom: '16px',
                                        flexWrap: 'wrap'
                                    }}>
                    <span style={{
                        background: '#f0f0f0',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '14px',
                        color: '#666'
                    }}>
                      🪑 {car.socho} chỗ
                    </span>
                                        <span style={{
                                            background: '#f0f0f0',
                                            padding: '6px 12px',
                                            borderRadius: '20px',
                                            fontSize: '14px',
                                            color: '#666'
                                        }}>
                      📅 {car.namsx}
                    </span>
                                        <span style={{
                                            background: '#f0f0f0',
                                            padding: '6px 12px',
                                            borderRadius: '20px',
                                            fontSize: '14px',
                                            color: '#666'
                                        }}>
                      🎨 {car.mausac}
                    </span>
                                    </div>

                                    <button style={{
                                        width: '100%',
                                        padding: '14px',
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontSize: '16px',
                                        fontWeight: 'bold',
                                        cursor: 'pointer',
                                        transition: 'opacity 0.3s'
                                    }}
                                            onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                                            onMouseLeave={(e) => e.target.style.opacity = '1'}>
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
                background: '#2c3e50',
                color: 'white',
                textAlign: 'center',
                padding: '30px 20px',
                marginTop: '60px'
            }}>
                <p style={{ margin: 0, fontSize: '16px' }}>
                    © 2025 OTO SHOP - Cửa hàng xe hơi uy tín
                </p>
                <p style={{ margin: '10px 0 0 0', fontSize: '14px', opacity: 0.7 }}>
                    📞 Hotline: 1900-xxxx | 📧 Email: contact@otoshop.vn
                </p>
            </footer>
        </div>
    );
}

export default HomePage;