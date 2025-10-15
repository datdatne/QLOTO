import api from './api';

const authService = {
    // Đăng nhập
    login: (username, password) => {
        return api.post('/auth/login', { username, password });
    },

    // Đăng ký
    register: (userData) => {
        return api.post('/auth/register', userData);
    },

    // Lưu thông tin user vào localStorage
    saveUser: (user) => {
        localStorage.setItem('user', JSON.stringify(user));
    },

    // Lấy thông tin user từ localStorage
    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    // Kiểm tra có phải admin không
    isAdmin: () => {
        const user = authService.getCurrentUser();
        return user && user.vaitro === 'ADMIN';
    },

    // Đăng xuất
    logout: () => {
        localStorage.removeItem('user');
    }
};

export default authService;