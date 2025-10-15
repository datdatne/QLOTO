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
    // Thêm xe mới
    createCar: (carData) => {
        return api.post('/cars', carData);
    },

    // Cập nhật thông tin xe
    updateCar: (id, carData) => {
        return api.put(`/cars/${id}`, carData);
    },

    // Xóa xe
    deleteCar: (id) => {
        return api.delete(`/cars/${id}`);
    },

    // Upload ảnh xe
    uploadCarImage: (id, file) => {
        const formData = new FormData();
        formData.append('file', file);

        return api.post(`/cars/${id}/upload-image`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }
};

export default carService;