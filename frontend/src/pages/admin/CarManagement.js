import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import carService from '../../services/carService';
import catalogService from '../../services/catalogService';
import authService from '../../services/authService';

function CarManagement() {
    const navigate = useNavigate();
    const [cars, setCars] = useState([]);
    const [catalogs, setCatalogs] = useState([]);
    const [loading, setLoading] = useState(true);

    // Pagination
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentCar, setCurrentCar] = useState({
        idCar: null,
        name: '',
        price: '',
        sale_price: '',
        socho: '',
        namsx: '',
        dongco: '',
        hopso: '',
        mausac: '',
        tinhtrang: 'Mới',
        mota: '',
        catalog: null,
        image: ''
    });

    // Delete confirm
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
        loadInitialData();
    }, [navigate]);

    // Load cars và catalogs
    const loadInitialData = async () => {
        try {
            const [carsResponse, catalogsResponse] = await Promise.all([
                carService.getAllCars(0, 10),
                catalogService.getAllCatalogs()
            ]);

            setCars(carsResponse.data.cars || []);
            setTotalPages(carsResponse.data.totalPages || 0);
            setTotalItems(carsResponse.data.totalItems || 0);
            setCurrentPage(carsResponse.data.currentPage || 0);

            setCatalogs(catalogsResponse.data || []);
            setLoading(false);
        } catch (error) {
            console.error('Lỗi:', error);
            showAlert('error', 'Không thể tải dữ liệu!');
            setLoading(false);
        }
    };

    // Load cars theo page
    const loadCars = async (page = 0) => {
        try {
            const response = await carService.getAllCars(page, 10);
            setCars(response.data.cars || []);
            setTotalPages(response.data.totalPages || 0);
            setTotalItems(response.data.totalItems || 0);
            setCurrentPage(response.data.currentPage || 0);
        } catch (error) {
            console.error('Lỗi:', error);
            showAlert('error', 'Không thể tải danh sách xe!');
        }
    };

    // Hiển thị alert
    const showAlert = (type, message) => {
        setAlert({ show: true, type, message });
        setTimeout(() => setAlert({ show: false, type: '', message: '' }), 3000);
    };

    // Mở modal THÊM
    const handleAddClick = () => {
        setEditMode(false);
        setCurrentCar({
            idCar: null,
            name: '',
            price: '',
            sale_price: '',
            socho: '',
            namsx: '',
            dongco: '',
            hopso: '',
            mausac: '',
            tinhtrang: 'Mới',
            mota: '',
            catalog: null,
            image: ''
        });
        setShowModal(true);
    };

    // Mở modal SỬA
    const handleEditClick = (car) => {
        setEditMode(true);
        setCurrentCar({
            ...car,
            catalog: car.catalog ? car.catalog.idCata : null
        });
        setShowModal(true);
    };

    // Xử lý thay đổi input
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentCar({
            ...currentCar,
            [name]: value
        });
    };

    // Xử lý LƯU
    const handleSave = async () => {
        // Validation
        if (!currentCar.name.trim()) {
            showAlert('error', 'Tên xe không được để trống!');
            return;
        }
        if (!currentCar.price || currentCar.price <= 0) {
            showAlert('error', 'Giá xe phải lớn hơn 0!');
            return;
        }
        if (!currentCar.catalog) {
            showAlert('error', 'Vui lòng chọn danh mục!');
            return;
        }

        try {
            const carData = {
                name: currentCar.name,
                price: parseFloat(currentCar.price),
                sale_price: currentCar.sale_price ? parseFloat(currentCar.sale_price) : null,
                socho: currentCar.socho ? parseInt(currentCar.socho) : null,
                namsx: currentCar.namsx ? parseInt(currentCar.namsx) : null,
                dongco: currentCar.dongco,
                hopso: currentCar.hopso,
                mausac: currentCar.mausac,
                tinhtrang: currentCar.tinhtrang,
                mota: currentCar.mota,
                image: currentCar.image || null,
                catalog: {
                    idCata: parseInt(currentCar.catalog)
                }
            };

            if (editMode) {
                await carService.updateCar(currentCar.idCar, carData);
                showAlert('success', 'Cập nhật xe thành công! ✅');
            } else {
                await carService.createCar(carData);
                showAlert('success', 'Thêm xe mới thành công! ✅');
            }

            setShowModal(false);
            loadCars(currentPage);
        } catch (error) {
            console.error('Lỗi:', error);
            showAlert('error', 'Có lỗi xảy ra khi lưu xe!');
        }
    };

    // Mở confirm xóa
    const handleDeleteClick = (id) => {
        setDeleteId(id);
        setShowDeleteConfirm(true);
    };

    // Xử lý XÓA
    const handleDelete = async () => {
        try {
            await carService.deleteCar(deleteId);
            showAlert('success', 'Xóa xe thành công! ✅');
            setShowDeleteConfirm(false);
            loadCars(currentPage);
        } catch (error) {
            console.error('Lỗi:', error);
            showAlert('error', 'Không thể xóa xe này!');
            setShowDeleteConfirm(false);
        }
    };

    // Xử lý phân trang
    const handlePageChange = (newPage) => {
        loadCars(newPage);
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f7fa' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '48px', marginBottom: '20px' }}>🚗</div>
                    <h2 style={{ color: '#667eea' }}>Đang tải dữ liệu...</h2>
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
                            cursor: 'pointer'
                        }}>
                        ← Quay lại
                    </button>
                    <h1 style={{ margin: 0, fontSize: '28px' }}>🚗 Quản lý Xe</h1>
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
                {/* Header actions */}
                <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ margin: 0, fontSize: '24px', color: '#333' }}>
                        Danh sách xe ({totalItems})
                    </h2>
                    <button
                        onClick={handleAddClick}
                        style={{
                            padding: '14px 28px',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
                        }}>
                        ➕ Thêm xe mới
                    </button>
                </div>

                {/* Table */}
                {cars.length === 0 ? (
                    <div style={{
                        background: 'white',
                        padding: '80px',
                        borderRadius: '16px',
                        textAlign: 'center',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}>
                        <div style={{ fontSize: '64px', marginBottom: '20px' }}>🚗</div>
                        <h3 style={{ color: '#999', fontSize: '20px' }}>Chưa có xe nào</h3>
                    </div>
                ) : (
                    <>
                        <div style={{
                            background: 'white',
                            borderRadius: '16px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            overflow: 'hidden'
                        }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                <tr style={{ background: '#f8f9fa' }}>
                                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: 'bold', color: '#555', borderBottom: '2px solid #e0e0e0' }}>Ảnh</th>
                                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: 'bold', color: '#555', borderBottom: '2px solid #e0e0e0' }}>Tên xe</th>
                                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: 'bold', color: '#555', borderBottom: '2px solid #e0e0e0' }}>Giá</th>
                                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: 'bold', color: '#555', borderBottom: '2px solid #e0e0e0' }}>Danh mục</th>
                                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: 'bold', color: '#555', borderBottom: '2px solid #e0e0e0' }}>Số chỗ</th>
                                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: 'bold', color: '#555', borderBottom: '2px solid #e0e0e0' }}>Năm SX</th>
                                    <th style={{ padding: '16px', textAlign: 'center', fontWeight: 'bold', color: '#555', borderBottom: '2px solid #e0e0e0', width: '200px' }}>Thao tác</th>
                                </tr>
                                </thead>
                                <tbody>
                                {cars.map((car) => (
                                    <tr key={car.idCar} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                        <td style={{ padding: '16px' }}>
                                            {car.image ? (
                                                <img
                                                    src={car.image}
                                                    alt={car.name}
                                                    style={{
                                                        width: '60px',
                                                        height: '60px',
                                                        objectFit: 'cover',
                                                        borderRadius: '8px',
                                                        border: '2px solid #e0e0e0'
                                                    }}
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                        e.target.nextSibling.style.display = 'flex';
                                                    }}
                                                />
                                            ) : null}
                                            <div style={{
                                                width: '60px',
                                                height: '60px',
                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                borderRadius: '8px',
                                                display: car.image ? 'none' : 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '24px'
                                            }}>
                                                🚗
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px', fontWeight: 'bold', color: '#333' }}>{car.name}</td>
                                        <td style={{ padding: '16px', color: '#667eea', fontWeight: 'bold' }}>
                                            {car.sale_price ? (
                                                <>
                                                    <div style={{ color: '#e74c3c' }}>{car.sale_price?.toLocaleString('vi-VN')} đ</div>
                                                    <div style={{ fontSize: '12px', textDecoration: 'line-through', color: '#999' }}>
                                                        {car.price?.toLocaleString('vi-VN')} đ
                                                    </div>
                                                </>
                                            ) : (
                                                <div>{car.price?.toLocaleString('vi-VN')} đ</div>
                                            )}
                                        </td>
                                        <td style={{ padding: '16px', color: '#666' }}>{car.catalog?.name || '-'}</td>
                                        <td style={{ padding: '16px', color: '#666' }}>{car.socho || '-'}</td>
                                        <td style={{ padding: '16px', color: '#666' }}>{car.namsx || '-'}</td>
                                        <td style={{ padding: '16px', textAlign: 'center' }}>
                                            <button
                                                onClick={() => handleEditClick(car)}
                                                style={{
                                                    padding: '8px 16px',
                                                    background: '#4CAF50',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    fontSize: '14px',
                                                    cursor: 'pointer',
                                                    marginRight: '8px'
                                                }}>
                                                ✏️ Sửa
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(car.idCar)}
                                                style={{
                                                    padding: '8px 16px',
                                                    background: '#e74c3c',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    fontSize: '14px',
                                                    cursor: 'pointer'
                                                }}>
                                                🗑️ Xóa
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 0}
                                    style={{
                                        padding: '10px 20px',
                                        background: currentPage === 0 ? '#e0e0e0' : '#667eea',
                                        color: currentPage === 0 ? '#999' : 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: currentPage === 0 ? 'not-allowed' : 'pointer'
                                    }}>
                                    ← Trước
                                </button>

                                <div style={{ padding: '10px 20px', background: 'white', borderRadius: '8px', fontWeight: 'bold' }}>
                                    Trang {currentPage + 1} / {totalPages}
                                </div>

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage >= totalPages - 1}
                                    style={{
                                        padding: '10px 20px',
                                        background: currentPage >= totalPages - 1 ? '#e0e0e0' : '#667eea',
                                        color: currentPage >= totalPages - 1 ? '#999' : 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: currentPage >= totalPages - 1 ? 'not-allowed' : 'pointer'
                                    }}>
                                    Sau →
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Modal Thêm/Sửa */}
            {showModal && (
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
                    overflowY: 'auto',
                    padding: '20px'
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
                            {editMode ? '✏️ Sửa thông tin xe' : '➕ Thêm xe mới'}
                        </h2>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            {/* Tên xe */}
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '15px', fontWeight: 'bold', color: '#555' }}>
                                    Tên xe *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={currentCar.name}
                                    onChange={handleInputChange}
                                    placeholder="Ví dụ: Toyota Camry 2024"
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '2px solid #e0e0e0',
                                        borderRadius: '8px',
                                        fontSize: '15px',
                                        outline: 'none',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>

                            {/* Giá */}
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '15px', fontWeight: 'bold', color: '#555' }}>
                                    Giá (VNĐ) *
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    value={currentCar.price}
                                    onChange={handleInputChange}
                                    placeholder="500000000"
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '2px solid #e0e0e0',
                                        borderRadius: '8px',
                                        fontSize: '15px',
                                        outline: 'none',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>

                            {/* Giá khuyến mãi */}
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '15px', fontWeight: 'bold', color: '#555' }}>
                                    Giá KM (VNĐ)
                                </label>
                                <input
                                    type="number"
                                    name="sale_price"
                                    value={currentCar.sale_price}
                                    onChange={handleInputChange}
                                    placeholder="450000000"
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '2px solid #e0e0e0',
                                        borderRadius: '8px',
                                        fontSize: '15px',
                                        outline: 'none',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>

                            {/* Danh mục */}
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '15px', fontWeight: 'bold', color: '#555' }}>
                                    Danh mục *
                                </label>
                                <select
                                    name="catalog"
                                    value={currentCar.catalog || ''}
                                    onChange={handleInputChange}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '2px solid #e0e0e0',
                                        borderRadius: '8px',
                                        fontSize: '15px',
                                        outline: 'none',
                                        boxSizing: 'border-box',
                                        cursor: 'pointer'
                                    }}>
                                    <option value="">-- Chọn danh mục --</option>
                                    {catalogs.map(cat => (
                                        <option key={cat.idCata} value={cat.idCata}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Số chỗ */}
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '15px', fontWeight: 'bold', color: '#555' }}>
                                    Số chỗ
                                </label>
                                <input
                                    type="number"
                                    name="socho"
                                    value={currentCar.socho}
                                    onChange={handleInputChange}
                                    placeholder="5"
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '2px solid #e0e0e0',
                                        borderRadius: '8px',
                                        fontSize: '15px',
                                        outline: 'none',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>

                            {/* Năm sản xuất */}
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '15px', fontWeight: 'bold', color: '#555' }}>
                                    Năm SX
                                </label>
                                <input
                                    type="number"
                                    name="namsx"
                                    value={currentCar.namsx}
                                    onChange={handleInputChange}
                                    placeholder="2024"
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '2px solid #e0e0e0',
                                        borderRadius: '8px',
                                        fontSize: '15px',
                                        outline: 'none',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>

                            {/* Động cơ */}
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '15px', fontWeight: 'bold', color: '#555' }}>
                                    Động cơ
                                </label>
                                <input
                                    type="text"
                                    name="dongco"
                                    value={currentCar.dongco}
                                    onChange={handleInputChange}
                                    placeholder="2.5L V6"
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '2px solid #e0e0e0',
                                        borderRadius: '8px',
                                        fontSize: '15px',
                                        outline: 'none',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>

                            {/* Hộp số */}
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '15px', fontWeight: 'bold', color: '#555' }}>
                                    Hộp số
                                </label>
                                <input
                                    type="text"
                                    name="hopso"
                                    value={currentCar.hopso}
                                    onChange={handleInputChange}
                                    placeholder="Tự động"
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '2px solid #e0e0e0',
                                        borderRadius: '8px',
                                        fontSize: '15px',
                                        outline: 'none',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>

                            {/* Màu sắc */}
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '15px', fontWeight: 'bold', color: '#555' }}>
                                    Màu sắc
                                </label>
                                <input
                                    type="text"
                                    name="mausac"
                                    value={currentCar.mausac}
                                    onChange={handleInputChange}
                                    placeholder="Đen"
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '2px solid #e0e0e0',
                                        borderRadius: '8px',
                                        fontSize: '15px',
                                        outline: 'none',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>

                            {/* Tình trạng */}
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '15px', fontWeight: 'bold', color: '#555' }}>
                                    Tình trạng
                                </label>
                                <select
                                    name="tinhtrang"
                                    value={currentCar.tinhtrang}
                                    onChange={handleInputChange}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '2px solid #e0e0e0',
                                        borderRadius: '8px',
                                        fontSize: '15px',
                                        outline: 'none',
                                        boxSizing: 'border-box',
                                        cursor: 'pointer'
                                    }}>
                                    <option value="Mới">Mới</option>
                                    <option value="Cũ">Cũ</option>
                                </select>
                            </div>

                            {/* Mô tả */}
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '15px', fontWeight: 'bold', color: '#555' }}>
                                    Mô tả
                                </label>
                                <textarea
                                    name="mota"
                                    value={currentCar.mota}
                                    onChange={handleInputChange}
                                    placeholder="Mô tả chi tiết về xe..."
                                    rows="4"
                                    style={{
                                        width: '100%',
                                        padding: '12px',
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

                            {/* URL ảnh */}
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '15px', fontWeight: 'bold', color: '#555' }}>
                                    🖼️ Link ảnh (URL)
                                </label>
                                <input
                                    type="text"
                                    name="image"
                                    value={currentCar.image || ''}
                                    onChange={handleInputChange}
                                    placeholder="https://example.com/car-image.jpg"
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '2px solid #e0e0e0',
                                        borderRadius: '8px',
                                        fontSize: '15px',
                                        outline: 'none',
                                        boxSizing: 'border-box'
                                    }}
                                />
                                {currentCar.image && (
                                    <div style={{ marginTop: '12px', textAlign: 'center' }}>
                                        <img
                                            src={currentCar.image}
                                            alt="Preview"
                                            style={{
                                                maxWidth: '100%',
                                                maxHeight: '200px',
                                                borderRadius: '8px',
                                                border: '2px solid #e0e0e0',
                                                objectFit: 'contain'
                                            }}
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/300x200?text=Invalid+Image';
                                            }}
                                        />
                                    </div>
                                )}
                                <p style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>
                                    💡 Tip: Tìm ảnh xe trên Google Images → Click phải → Copy image address
                                </p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '30px' }}>
                            <button
                                onClick={() => setShowModal(false)}
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
                                onClick={handleSave}
                                style={{
                                    padding: '12px 24px',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer'
                                }}>
                                💾 Lưu
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
                            Xác nhận xóa xe
                        </h3>
                        <p style={{ margin: '0 0 30px 0', fontSize: '16px', color: '#666' }}>
                            Bạn có chắc chắn muốn xóa xe này không?<br />
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

export default CarManagement;