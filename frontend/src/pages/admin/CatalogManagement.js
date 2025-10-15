import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import catalogService from '../../services/catalogService';
import authService from '../../services/authService';

function CatalogManagement() {
    const navigate = useNavigate();
    const [catalogs, setCatalogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentCatalog, setCurrentCatalog] = useState({ idCata: null, name: '', mota: '' });

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [alert, setAlert] = useState({ show: false, type: '', message: '' });

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        if (!currentUser || currentUser.vaitro !== 'ADMIN') {
            navigate('/admin/login');
            return;
        }
        loadCatalogs();
    }, [navigate]);

    const loadCatalogs = async () => {
        try {
            const response = await catalogService.getAllCatalogs();
            setCatalogs(response.data || []);
            setLoading(false);
        } catch (error) {
            console.error('Lỗi:', error);
            showAlert('error', 'Không thể tải danh sách danh mục!');
            setLoading(false);
        }
    };

    const showAlert = (type, message) => {
        setAlert({ show: true, type, message });
        setTimeout(() => setAlert({ show: false, type: '', message: '' }), 3000);
    };

    const handleAddClick = () => {
        setEditMode(false);
        setCurrentCatalog({ idCata: null, name: '', mota: '' });
        setShowModal(true);
    };

    const handleEditClick = (catalog) => {
        setEditMode(true);
        setCurrentCatalog({ ...catalog });
        setShowModal(true);
    };

    const handleInputChange = (e) => {
        setCurrentCatalog({ ...currentCatalog, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        if (!currentCatalog.name.trim()) {
            showAlert('error', 'Tên danh mục không được để trống!');
            return;
        }

        try {
            if (editMode) {
                await catalogService.updateCatalog(currentCatalog.idCata, {
                    name: currentCatalog.name,
                    mota: currentCatalog.mota
                });
                showAlert('success', '✅ Cập nhật danh mục thành công!');
            } else {
                await catalogService.createCatalog({
                    name: currentCatalog.name,
                    mota: currentCatalog.mota
                });
                showAlert('success', '✅ Thêm danh mục thành công!');
            }

            setShowModal(false);
            loadCatalogs();
        } catch (error) {
            console.error('Lỗi:', error);
            showAlert('error', '❌ Có lỗi xảy ra khi lưu!');
        }
    };

    const handleDeleteClick = (id) => {
        setDeleteId(id);
        setShowDeleteConfirm(true);
    };

    const handleDelete = async () => {
        try {
            await catalogService.deleteCatalog(deleteId);
            showAlert('success', '✅ Xóa danh mục thành công!');
            setShowDeleteConfirm(false);
            loadCatalogs();
        } catch (error) {
            console.error('Lỗi:', error);
            showAlert('error', '❌ Không thể xóa danh mục!');
            setShowDeleteConfirm(false);
        }
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                <div style={{ textAlign: 'center', color: 'white' }}>
                    <div style={{ fontSize: '64px', marginBottom: '20px', animation: 'pulse 2s infinite' }}>📂</div>
                    <h2 style={{ fontSize: '24px', fontWeight: '300' }}>Đang tải dữ liệu...</h2>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: '#f0f2f5' }}>
            {/* Modern Header */}
            <header style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: '0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <button
                            onClick={() => navigate('/admin/dashboard')}
                            style={{
                                background: 'rgba(255,255,255,0.15)',
                                backdropFilter: 'blur(10px)',
                                color: 'white',
                                border: 'none',
                                padding: '10px 20px',
                                borderRadius: '8px',
                                fontSize: '15px',
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                fontWeight: '500'
                            }}
                            onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.25)'}
                            onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.15)'}>
                            ← Dashboard
                        </button>
                        <div>
                            <h1 style={{ margin: 0, fontSize: '28px', color: 'white', fontWeight: '600' }}>
                                Quản lý Danh mục
                            </h1>
                            <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: 'rgba(255,255,255,0.8)', fontWeight: '300' }}>
                                Quản lý các loại xe trong hệ thống
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Toast Alert */}
            {alert.show && (
                <div style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    padding: '16px 24px',
                    background: 'white',
                    color: alert.type === 'success' ? '#10b981' : '#ef4444',
                    borderLeft: `4px solid ${alert.type === 'success' ? '#10b981' : '#ef4444'}`,
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    zIndex: 1000,
                    fontSize: '15px',
                    fontWeight: '500',
                    animation: 'slideInRight 0.3s ease'
                }}>
                    {alert.message}
                </div>
            )}

            {/* Content */}
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 20px' }}>
                {/* Stats & Action Bar */}
                <div style={{
                    background: 'white',
                    padding: '24px',
                    borderRadius: '12px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    marginBottom: '24px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div>
                        <h2 style={{ margin: '0 0 4px 0', fontSize: '20px', color: '#1f2937', fontWeight: '600' }}>
                            Danh sách danh mục
                        </h2>
                        <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
                            Tổng cộng {catalogs.length} danh mục
                        </p>
                    </div>
                    <button
                        onClick={handleAddClick}
                        style={{
                            padding: '12px 24px',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '15px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                            transition: 'transform 0.2s, boxShadow 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.5)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
                        }}>
                        + Thêm danh mục
                    </button>
                </div>

                {/* Table Card */}
                {catalogs.length === 0 ? (
                    <div style={{
                        background: 'white',
                        padding: '80px',
                        borderRadius: '12px',
                        textAlign: 'center',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }}>
                        <div style={{ fontSize: '64px', marginBottom: '16px', opacity: 0.5 }}>📂</div>
                        <h3 style={{ color: '#9ca3af', fontSize: '18px', margin: '0 0 12px 0', fontWeight: '500' }}>
                            Chưa có danh mục nào
                        </h3>
                        <button
                            onClick={handleAddClick}
                            style={{
                                padding: '10px 20px',
                                background: '#667eea',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '14px',
                                fontWeight: '500',
                                cursor: 'pointer'
                            }}>
                            Thêm danh mục đầu tiên
                        </button>
                    </div>
                ) : (
                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        overflow: 'hidden'
                    }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                            <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                                <th style={{ padding: '16px 24px', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    ID
                                </th>
                                <th style={{ padding: '16px 24px', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    Tên danh mục
                                </th>
                                <th style={{ padding: '16px 24px', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    Mô tả
                                </th>
                                <th style={{ padding: '16px 24px', textAlign: 'center', fontWeight: '600', color: '#374151', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px', width: '180px' }}>
                                    Thao tác
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {catalogs.map((catalog, index) => (
                                <tr
                                    key={catalog.idCata}
                                    style={{
                                        borderBottom: index < catalogs.length - 1 ? '1px solid #f3f4f6' : 'none',
                                        transition: 'background 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'white'}>
                                    <td style={{ padding: '16px 24px', color: '#6b7280', fontSize: '14px', fontWeight: '500' }}>
                                        #{catalog.idCata}
                                    </td>
                                    <td style={{ padding: '16px 24px', fontWeight: '600', color: '#111827', fontSize: '15px' }}>
                                        {catalog.name}
                                    </td>
                                    <td style={{ padding: '16px 24px', color: '#6b7280', fontSize: '14px', maxWidth: '300px' }}>
                                        {catalog.mota || <span style={{ fontStyle: 'italic', color: '#d1d5db' }}>Chưa có mô tả</span>}
                                    </td>
                                    <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                                        <button
                                            onClick={() => handleEditClick(catalog)}
                                            style={{
                                                padding: '6px 16px',
                                                background: '#10b981',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '6px',
                                                fontSize: '13px',
                                                fontWeight: '500',
                                                cursor: 'pointer',
                                                marginRight: '8px',
                                                transition: 'background 0.2s'
                                            }}
                                            onMouseEnter={(e) => e.target.style.background = '#059669'}
                                            onMouseLeave={(e) => e.target.style.background = '#10b981'}>
                                            Sửa
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(catalog.idCata)}
                                            style={{
                                                padding: '6px 16px',
                                                background: '#ef4444',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '6px',
                                                fontSize: '13px',
                                                fontWeight: '500',
                                                cursor: 'pointer',
                                                transition: 'background 0.2s'
                                            }}
                                            onMouseEnter={(e) => e.target.style.background = '#dc2626'}
                                            onMouseLeave={(e) => e.target.style.background = '#ef4444'}>
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modern Modal */}
            {showModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    animation: 'fadeIn 0.2s ease'
                }}>
                    <div style={{
                        background: 'white',
                        padding: '32px',
                        borderRadius: '16px',
                        width: '90%',
                        maxWidth: '500px',
                        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
                        animation: 'slideUp 0.3s ease'
                    }}>
                        <h2 style={{ margin: '0 0 24px 0', fontSize: '22px', color: '#111827', fontWeight: '600' }}>
                            {editMode ? 'Sửa danh mục' : 'Thêm danh mục mới'}
                        </h2>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                                Tên danh mục *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={currentCatalog.name}
                                onChange={handleInputChange}
                                placeholder="Ví dụ: Sedan, SUV..."
                                style={{
                                    width: '100%',
                                    padding: '10px 14px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '8px',
                                    fontSize: '15px',
                                    outline: 'none',
                                    boxSizing: 'border-box',
                                    transition: 'border 0.2s'
                                }}
                                onFocus={(e) => e.target.style.border = '1px solid #667eea'}
                                onBlur={(e) => e.target.style.border = '1px solid #d1d5db'}
                            />
                        </div>

                        <div style={{ marginBottom: '28px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                                Mô tả
                            </label>
                            <textarea
                                name="mota"
                                value={currentCatalog.mota}
                                onChange={handleInputChange}
                                placeholder="Mô tả chi tiết về danh mục..."
                                rows="4"
                                style={{
                                    width: '100%',
                                    padding: '10px 14px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '8px',
                                    fontSize: '15px',
                                    outline: 'none',
                                    resize: 'vertical',
                                    boxSizing: 'border-box',
                                    fontFamily: 'inherit',
                                    transition: 'border 0.2s'
                                }}
                                onFocus={(e) => e.target.style.border = '1px solid #667eea'}
                                onBlur={(e) => e.target.style.border = '1px solid #d1d5db'}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => setShowModal(false)}
                                style={{
                                    padding: '10px 20px',
                                    background: '#f3f4f6',
                                    color: '#374151',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    transition: 'background 0.2s'
                                }}
                                onMouseEnter={(e) => e.target.style.background = '#e5e7eb'}
                                onMouseLeave={(e) => e.target.style.background = '#f3f4f6'}>
                                Hủy
                            </button>
                            <button
                                onClick={handleSave}
                                style={{
                                    padding: '10px 20px',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    transition: 'opacity 0.2s'
                                }}
                                onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                                onMouseLeave={(e) => e.target.style.opacity = '1'}>
                                {editMode ? 'Cập nhật' : 'Thêm mới'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirm */}
            {showDeleteConfirm && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        background: 'white',
                        padding: '32px',
                        borderRadius: '16px',
                        width: '90%',
                        maxWidth: '400px',
                        textAlign: 'center',
                        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
                    }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
                        <h3 style={{ margin: '0 0 12px 0', fontSize: '20px', color: '#111827', fontWeight: '600' }}>
                            Xác nhận xóa
                        </h3>
                        <p style={{ margin: '0 0 24px 0', fontSize: '15px', color: '#6b7280', lineHeight: '1.6' }}>
                            Bạn có chắc chắn muốn xóa danh mục này?<br />
                            Hành động này không thể hoàn tác!
                        </p>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                style={{
                                    padding: '10px 20px',
                                    background: '#f3f4f6',
                                    color: '#374151',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    cursor: 'pointer'
                                }}>
                                Hủy
                            </button>
                            <button
                                onClick={handleDelete}
                                style={{
                                    padding: '10px 20px',
                                    background: '#ef4444',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    cursor: 'pointer'
                                }}>
                                Xóa
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                @keyframes slideInRight {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            `}</style>
        </div>
    );
}

export default CatalogManagement;