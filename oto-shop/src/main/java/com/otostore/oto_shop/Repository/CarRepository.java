package com.otostore.oto_shop.Repository;

import com.otostore.oto_shop.Entity.Car;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CarRepository extends JpaRepository<Car, Integer> {

    // Tìm kiếm xe theo tên (không phân biệt hoa thường)
    List<Car> findByNameContainingIgnoreCase(String name);

    // Lọc xe theo danh mục (catalog) - Sửa lại thành catalog.idCata
    @Query("SELECT c FROM Car c WHERE c.catalog.idCata = :catalogId")
    List<Car> findByCatalogId(Integer catalogId);

    // Lọc xe theo khoảng giá
    List<Car> findByPriceBetween(Double minPrice, Double maxPrice);

    // Tìm xe theo màu sắc
    List<Car> findByMausacContainingIgnoreCase(String mausac);

    // Tìm xe theo số chỗ ngồi
    List<Car> findBySocho(Integer socho);

    // Tìm xe theo năm sản xuất
    List<Car> findByNamsx(Integer namsx);

    // Lấy xe theo giá khuyến mãi (sale_price) - Xe bán chạy
    @Query("SELECT c FROM Car c WHERE c.sale_price IS NOT NULL ORDER BY c.sale_price ASC")
    List<Car> findTopBySalePrice(Pageable pageable);

    // Tìm xe theo hãng sản xuất (dongco)
    List<Car> findByDongcoContainingIgnoreCase(String dongco);

    // Lấy xe mới nhất
    @Query("SELECT c FROM Car c ORDER BY c.ngayNhap DESC")
    List<Car> findLatestCars(Pageable pageable);
}