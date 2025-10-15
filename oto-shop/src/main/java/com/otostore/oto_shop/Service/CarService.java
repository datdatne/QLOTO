package com.otostore.oto_shop.Service;

import com.otostore.oto_shop.Entity.Car;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

public interface CarService {

    // Lấy tất cả xe
    List<Car> getAllCars();

    // Lấy tất cả xe với phân trang
    Page<Car> getAllCars(Pageable pageable);

    // Lấy xe theo ID (trả về Optional)
    Optional<Car> getCarById(Integer id);

    // Tìm kiếm xe theo tên
    List<Car> searchCarsByName(String name);

    // Lọc xe theo danh mục
    List<Car> getCarsByCatalog(Integer catalogId);

    // Lọc xe theo khoảng giá
    List<Car> getCarsByPriceRange(Double minPrice, Double maxPrice);

    // Lọc xe theo màu sắc
    List<Car> findByMausac(String mausac);

    // Lọc xe theo số chỗ
    List<Car> findBySocho(Integer socho);

    // Lọc xe theo năm sản xuất
    List<Car> findByNamsx(Integer namsx);

    // Thêm xe mới
    Car addCar(Car car);

    // Cập nhật xe
    Car updateCar(Integer id, Car car);

    // Xóa xe
    void deleteCar(Integer id);

    // Upload ảnh
    String uploadImage(Integer carId, MultipartFile file) throws Exception;

    // Lấy xe bán chạy
    List<Car> getBestSellers(int limit);
}