package com.otostore.oto_shop.Service;

import com.otostore.oto_shop.Entity.Car;
import com.otostore.oto_shop.Exception.ResourceNotFoundException;
import com.otostore.oto_shop.Repository.CarRepository;
import com.otostore.oto_shop.Service.CarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class CarServiceImpl implements CarService {

    @Autowired
    private CarRepository carRepository;

    // Đường dẫn lưu ảnh
    @Value("${upload.path:uploads/cars}")
    private String uploadPath;

    @Override
    public List<Car> getAllCars() {
        return carRepository.findAll();
    }

    @Override
    public Page<Car> getAllCars(Pageable pageable) {
        return carRepository.findAll(pageable);
    }

    @Override
    public Optional<Car> getCarById(Integer id) {
        return carRepository.findById(id);
    }

    @Override
    public List<Car> searchCarsByName(String name) {
        return carRepository.findByNameContainingIgnoreCase(name);
    }

    @Override
    public List<Car> getCarsByCatalog(Integer catalogId) {
        return carRepository.findByCatalogId(catalogId);
    }

    @Override
    public List<Car> getCarsByPriceRange(Double minPrice, Double maxPrice) {
        return carRepository.findByPriceBetween(minPrice, maxPrice);
    }

    @Override
    public List<Car> findByMausac(String mausac) {
        return carRepository.findByMausacContainingIgnoreCase(mausac);
    }

    @Override
    public List<Car> findBySocho(Integer socho) {
        return carRepository.findBySocho(socho);
    }

    @Override
    public List<Car> findByNamsx(Integer namsx) {
        return carRepository.findByNamsx(namsx);
    }

    @Override
    public Car addCar(Car car) {
        return carRepository.save(car);
    }

    @Override
    public Car updateCar(Integer id, Car car) {
        Optional<Car> existingCar = carRepository.findById(id);
        if (existingCar.isPresent()) {
            car.setIdCar(id); // ← SỬA LẠI: setIdCar thay vì setId_car
            return carRepository.save(car);
        }
        throw new RuntimeException("Không tìm thấy xe với ID: " + id);
    }

    @Override
    public void deleteCar(Integer id) {
        carRepository.deleteById(id);
    }

    @Override
    public String uploadImage(Integer carId, MultipartFile file) throws Exception {
        // Kiểm tra xe có tồn tại không
        Optional<Car> optionalCar = getCarById(carId);
        if (!optionalCar.isPresent()) {
            throw new Exception("Không tìm thấy xe với ID: " + carId);
        }
        Car car = optionalCar.get();

        // Kiểm tra file có rỗng không
        if (file.isEmpty()) {
            throw new Exception("File rỗng");
        }

        // Kiểm tra định dạng file
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new Exception("File không phải là ảnh");
        }

        // Tạo thư mục nếu chưa tồn tại
        File uploadDir = new File(uploadPath);
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }

        // Tạo tên file unique
        String originalFilename = file.getOriginalFilename();
        String fileExtension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String newFilename = UUID.randomUUID().toString() + fileExtension;

        // Lưu file
        Path filePath = Paths.get(uploadPath, newFilename);
        Files.copy(file.getInputStream(), filePath);

        // Cập nhật đường dẫn ảnh vào database
        String imageUrl = "/uploads/cars/" + newFilename;
        car.setImage(imageUrl);
        carRepository.save(car);

        return imageUrl;
    }

    @Override
    public List<Car> getBestSellers(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        return carRepository.findTopBySalePrice(pageable);
    }
}