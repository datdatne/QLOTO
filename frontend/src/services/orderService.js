import api from './api';

const orderService = {
    // Tạo đơn hàng mới
    createOrder: (orderData) => {
        return api.post('/orders', orderData);
    },

    // Lấy đơn hàng theo user
    getOrdersByUser: (userId) => {
        return api.get(`/orders/user/${userId}`);
    },

    // Lấy tất cả đơn hàng
    getAllOrders: () => {
        return api.get('/orders');
    },

    // Lấy đơn hàng theo ID
    getOrderById: (id) => {
        return api.get(`/orders/${id}`);
    },
};

export default orderService;