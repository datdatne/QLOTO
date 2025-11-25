package com.otostore.oto_shop.Controller;

import com.otostore.oto_shop.Service.DonHangChiTietService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/statistics")
@CrossOrigin(origins = "*")
public class StatisticsController {

    @Autowired
    private DonHangChiTietService donHangChiTietService;

    // 1. Lấy tổng số lượng TẤT CẢ xe đã bán
    @GetMapping("/total-cars-sold")
    public ResponseEntity<Map<String, Object>> getTotalCarsSold() {
        try {
            Long totalSold = donHangChiTietService.getTotalCarsSold();

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Thống kê tổng số xe đã bán");
            response.put("totalCarsSold", totalSold);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 2. Lấy số lượng của 1 xe cụ thể đã bán
    @GetMapping("/cars/{carId}/sold")
    public ResponseEntity<Map<String, Object>> getCarSoldQuantity(@PathVariable Integer carId) {
        try {
            Long soldQuantity = donHangChiTietService.getTotalSoldByCarId(carId);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Số lượng xe đã bán");
            response.put("carId", carId);
            response.put("soldQuantity", soldQuantity);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}