package com.otostore.oto_shop.Controller;

import com.otostore.oto_shop.Entity.Car;
import com.otostore.oto_shop.Service.CarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/cars")
@CrossOrigin(origins = "*")
public class CarController {

    @Autowired
    private CarService carService;

    // 1. Lấy tất cả xe (có phân trang)
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllCars(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "idCar") String sortBy) {

        try {
            Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).descending());
            Page<Car> carPage = carService.getAllCars(pageable);

            Map<String, Object> response = new HashMap<>();
            response.put("cars", carPage.getContent());
            response.put("currentPage", carPage.getNumber());
            response.put("totalItems", carPage.getTotalElements());
            response.put("totalPages", carPage.getTotalPages());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 2. Lấy xe theo ID
    @GetMapping("/{id}")
    public ResponseEntity<Car> getCarById(@PathVariable Integer id) {
        try {
            Optional<Car> car = carService.getCarById(id);
            if (car.isPresent()) {
                return ResponseEntity.ok(car.get());
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 3. Tìm kiếm xe theo tên
    @GetMapping("/search")
    public ResponseEntity<List<Car>> searchCarsByName(@RequestParam String name) {
        try {
            List<Car> cars = carService.searchCarsByName(name);
            return ResponseEntity.ok(cars);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 4. Lọc xe theo danh mục
    @GetMapping("/catalog/{catalogId}")
    public ResponseEntity<List<Car>> getCarsByCatalog(@PathVariable Integer catalogId) {
        try {
            List<Car> cars = carService.getCarsByCatalog(catalogId);
            return ResponseEntity.ok(cars);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 5. Lọc xe theo màu sắc
    @GetMapping("/color/{mausac}")
    public ResponseEntity<List<Car>> findByMausac(@PathVariable String mausac) {
        try {
            List<Car> cars = carService.findByMausac(mausac);
            return ResponseEntity.ok(cars);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 6. Lọc xe theo khoảng giá ()
    @GetMapping("/price")
    public ResponseEntity<List<Car>> findByPriceBetween(
            @RequestParam Double min,
            @RequestParam Double max) {
        try {
            List<Car> cars = carService.getCarsByPriceRange(min, max);
            return ResponseEntity.ok(cars);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 7. Lọc xe theo số chỗ
    @GetMapping("/socho/{socho}")
    public ResponseEntity<List<Car>> findBySocho(@PathVariable Integer socho) {
        try {
            List<Car> cars = carService.findBySocho(socho);
            return ResponseEntity.ok(cars);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 8. Lọc xe theo năm sản xuất
    @GetMapping("/namsx/{namsx}")
    public ResponseEntity<List<Car>> findByNamsx(@PathVariable Integer namsx) {
        try {
            List<Car> cars = carService.findByNamsx(namsx);
            return ResponseEntity.ok(cars);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 9. Thêm xe mới (chỉ ADMIN)
    @PostMapping
    public ResponseEntity<Car> createCar(@RequestBody Car car) {
        try {
            Car savedCar = carService.addCar(car);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedCar);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    // 10. Cập nhật thông tin xe (chỉ ADMIN)
    @PutMapping("/{id}")
    public ResponseEntity<Car> updateCar(@PathVariable Integer id, @RequestBody Car car) {
        try {
            Car updatedCar = carService.updateCar(id, car);
            return ResponseEntity.ok(updatedCar);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    // 11. Xóa xe (chỉ ADMIN)
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteCar(@PathVariable Integer id) {
        try {
            Optional<Car> car = carService.getCarById(id);
            if (!car.isPresent()) {
                return ResponseEntity.notFound().build();
            }
            carService.deleteCar(id);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Xóa xe thành công");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 12. Upload ảnh xe
    @PostMapping("/{id}/upload-image")
    public ResponseEntity<Map<String, String>> uploadCarImage(
            @PathVariable Integer id,
            @RequestParam("file") MultipartFile file) {
        try {
            String imageUrl = carService.uploadImage(id, file);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Upload ảnh thành công");
            response.put("imageUrl", imageUrl);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    // 13. Lấy xe bán chạy
    @GetMapping("/best-sellers")
    public ResponseEntity<List<Car>> getBestSellers(@RequestParam(defaultValue = "10") int limit) {
        try {
            List<Car> cars = carService.getBestSellers(limit);
            return ResponseEntity.ok(cars);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}