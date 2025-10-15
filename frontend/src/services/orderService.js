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

    // Lấy tất cả đơn hàng (ADMIN)
    getAllOrders: () => {
        return api.get('/orders');
    },

    // Lấy đơn hàng theo ID
    getOrderById: (id) => {
        return api.get(`/orders/${id}`);
    },

    // Cập nhật đơn hàng (ADMIN)
    updateOrder: (id, orderData) => {
        return api.put(`/orders/${id}`, orderData);
    },

    // Xóa đơn hàng (ADMIN)
    deleteOrder: (id) => {
        return api.delete(`/orders/${id}`);
    },

    // Lấy đơn hàng mới nhất
    getLatestOrders: () => {
        return api.get('/orders/latest');
    },

    // Đếm số đơn hàng của user
    countOrdersByUser: (userId) => {
        return api.get(`/orders/count/user/${userId}`);
    }
};

export default orderService;