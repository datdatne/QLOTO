package com.otostore.oto_shop.Service;

import com.otostore.oto_shop.Entity.Catalog;

import java.util.List;
import java.util.Optional;

public interface CatalogService {

    // Lấy tất cả danh mục
    List<Catalog> getAllCatalogs();

    // Lấy danh mục theo ID
    Optional<Catalog> getCatalogById(Integer id);

    // Thêm danh mục mới
    Catalog createCatalog(Catalog catalog);

    // Cập nhật danh mục
    Catalog updateCatalog(Integer id, Catalog catalog);

    // Xóa danh mục
    void deleteCatalog(Integer id);
}