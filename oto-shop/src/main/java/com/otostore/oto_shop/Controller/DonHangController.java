package com.otostore.oto_shop.Controller;

import com.otostore.oto_shop.Entity.DonHang;
import com.otostore.oto_shop.Service.DonHangService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class DonHangController {

    @Autowired
    private DonHangService donHangService;

    // 1. Lấy tất cả đơn hàng (ADMIN)
    @GetMapping
    public ResponseEntity<List<DonHang>> getAllOrders() {
        try {
            List<DonHang> orders = donHangService.getAllOrders();
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 2. Lấy đơn hàng theo ID
    @GetMapping("/{id}")
    public ResponseEntity<DonHang> getOrderById(@PathVariable Integer id) {
        try {
            Optional<DonHang> order = donHangService.getOrderById(id);
            if (order.isPresent()) {
                return ResponseEntity.ok(order.get());
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 3. Lấy đơn hàng của 1 user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<DonHang>> getOrdersByUserId(@PathVariable Integer userId) {
        try {
            List<DonHang> orders = donHangService.getOrdersByUserId(userId);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 4. Tạo đơn hàng mới
    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody DonHang donHang) {
        try {
            DonHang savedOrder = donHangService.createOrder(donHang);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Đặt hàng thành công");
            response.put("order", savedOrder);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    // 5. Cập nhật đơn hàng (ADMIN)
    @PutMapping("/{id}")
    public ResponseEntity<?> updateOrder(@PathVariable Integer id, @RequestBody DonHang donHang) {
        try {
            DonHang updatedOrder = donHangService.updateOrder(id, donHang);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Cập nhật đơn hàng thành công");
            response.put("order", updatedOrder);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    // 6. Xóa đơn hàng (ADMIN)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOrder(@PathVariable Integer id) {
        try {
            donHangService.deleteOrder(id);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Xóa đơn hàng thành công");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 7. Lấy đơn hàng mới nhất
    @GetMapping("/latest")
    public ResponseEntity<List<DonHang>> getLatestOrders() {
        try {
            List<DonHang> orders = donHangService.getLatestOrders();
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 8. Đếm số đơn hàng của user
    @GetMapping("/count/user/{userId}")
    public ResponseEntity<Map<String, Long>> countOrdersByUserId(@PathVariable Integer userId) {
        try {
            long count = donHangService.countOrdersByUserId(userId);
            Map<String, Long> response = new HashMap<>();
            response.put("count", count);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}