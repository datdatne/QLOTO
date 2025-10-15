import api from './api';

const carService = {
    // Lấy tất cả xe
    getAllCars: (page = 0, size = 10) => {
        return api.get(`/cars?page=${page}&size=${size}`);
    },

    // Lấy xe theo ID
    getCarById: (id) => {
        return api.get(`/cars/${id}`);
    },

    // Tìm kiếm xe theo tên
    searchCars: (name) => {
        return api.get(`/cars/search?name=${name}`);
    },

    // Lọc xe theo danh mục
    getCarsByCategory: (catalogId) => {
        return api.get(`/cars/catalog/${catalogId}`);
    },

    // Lọc xe theo khoảng giá
    getCarsByPrice: (minPrice, maxPrice) => {
        return api.get(`/cars/price?min=${minPrice}&max=${maxPrice}`);
    },

    // Lọc xe theo số chỗ
    getCarsBySeat: (socho) => {
        return api.get(`/cars/socho/${socho}`);
    },

    // Lấy xe bán chạy
    getBestSellers: (limit = 6) => {
        return api.get(`/cars/best-sellers?limit=${limit}`);
    },
};

export default carService;