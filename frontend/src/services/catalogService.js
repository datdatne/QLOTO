import api from './api';

const catalogService = {
    // Lấy tất cả danh mục
    getAllCatalogs: () => {
        return api.get('/catalogs');
    },

    // Lấy danh mục theo ID
    getCatalogById: (id) => {
        return api.get(`/catalogs/${id}`);
    },

    // Thêm danh mục mới
    createCatalog: (catalogData) => {
        return api.post('/catalogs', catalogData);
    },

    // Cập nhật danh mục
    updateCatalog: (id, catalogData) => {
        return api.put(`/catalogs/${id}`, catalogData);
    },

    // Xóa danh mục
    deleteCatalog: (id) => {
        return api.delete(`/catalogs/${id}`);
    }
};

export default catalogService;