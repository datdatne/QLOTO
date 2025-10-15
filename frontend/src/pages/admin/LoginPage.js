import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await authService.login(username, password);
            const user = response.data.user;

            // Kiểm tra có phải admin không
            if (user.vaitro !== 'ADMIN') {
                setError('Bạn không có quyền truy cập vào trang quản trị!');
                setLoading(false);
                return;
            }

            // Lưu thông tin user
            authService.saveUser(user);

            // Chuyển đến dashboard
            navigate('/admin/dashboard');
        } catch (err) {
            console.error('Lỗi đăng nhập:', err);
            setError('Tên đăng nhập hoặc mật khẩu không đúng!');
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}>
            <div style={{
                background: 'white',
                padding: '50px 60px',
                borderRadius: '20px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                width: '100%',
                maxWidth: '450px'
            }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <div style={{ fontSize: '64px', marginBottom: '10px' }}>👨‍💼</div>
                    <h2 style={{ margin: 0, fontSize: '32px', color: '#333' }}>
                        Admin Login
                    </h2>
                    <p style={{ margin: '8px 0 0 0', fontSize: '16px', color: '#999' }}>
                        Trang quản trị OTO SHOP
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Username */}
                    <div style={{ marginBottom: '25px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '10px',
                            fontSize: '15px',
                            fontWeight: 'bold',
                            color: '#555'
                        }}>
                            👤 Tên đăng nhập
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            placeholder="Nhập username..."
                            style={{
                                width: '100%',
                                padding: '16px',
                                border: '2px solid #e0e0e0',
                                borderRadius: '10px',
                                fontSize: '16px',
                                outline: 'none',
                                boxSizing: 'border-box',
                                transition: 'border 0.3s'
                            }}
                            onFocus={(e) => e.target.style.border = '2px solid #667eea'}
                            onBlur={(e) => e.target.style.border = '2px solid #e0e0e0'}
                        />
                    </div>

                    {/* Password */}
                    <div style={{ marginBottom: '30px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '10px',
                            fontSize: '15px',
                            fontWeight: 'bold',
                            color: '#555'
                        }}>
                            🔒 Mật khẩu
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Nhập mật khẩu..."
                            style={{
                                width: '100%',
                                padding: '16px',
                                border: '2px solid #e0e0e0',
                                borderRadius: '10px',
                                fontSize: '16px',
                                outline: 'none',
                                boxSizing: 'border-box',
                                transition: 'border 0.3s'
                            }}
                            onFocus={(e) => e.target.style.border = '2px solid #667eea'}
                            onBlur={(e) => e.target.style.border = '2px solid #e0e0e0'}
                        />
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div style={{
                            padding: '14px',
                            background: '#fee',
                            color: '#c33',
                            borderRadius: '10px',
                            marginBottom: '25px',
                            fontSize: '15px',
                            textAlign: 'center'
                        }}>
                            ❌ {error}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '18px',
                            background: loading ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '10px',
                            fontSize: '18px',
                            fontWeight: 'bold',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'opacity 0.3s',
                            marginBottom: '20px'
                        }}
                        onMouseEnter={(e) => !loading && (e.target.style.opacity = '0.9')}
                        onMouseLeave={(e) => !loading && (e.target.style.opacity = '1')}>
                        {loading ? '⏳ Đang đăng nhập...' : '🚀 Đăng nhập'}
                    </button>

                    {/* Back to Home */}
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        style={{
                            width: '100%',
                            padding: '14px',
                            background: 'transparent',
                            color: '#667eea',
                            border: '2px solid #667eea',
                            borderRadius: '10px',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            transition: 'all 0.3s'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.background = '#667eea';
                            e.target.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = 'transparent';
                            e.target.style.color = '#667eea';
                        }}>
                        ← Về trang chủ
                    </button>
                </form>

                {/* Demo Info */}
                <div style={{
                    marginTop: '30px',
                    padding: '15px',
                    background: '#f8f9fa',
                    borderRadius: '10px',
                    fontSize: '14px',
                    color: '#666',
                    textAlign: 'center'
                }}>
                    <p style={{ margin: 0 }}>
                        <strong>Demo:</strong> Sử dụng tài khoản admin đã tạo qua Postman
                    </p>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;