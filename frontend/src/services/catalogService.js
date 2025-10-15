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
};

export default catalogService;