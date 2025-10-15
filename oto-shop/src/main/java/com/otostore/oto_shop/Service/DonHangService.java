package com.otostore.oto_shop.Service;

import com.otostore.oto_shop.Entity.DonHang;

import java.util.List;
import java.util.Optional;

public interface DonHangService {

    // Lấy tất cả đơn hàng
    List<DonHang> getAllOrders();

    // Lấy đơn hàng theo ID
    Optional<DonHang> getOrderById(Integer id);

    // Lấy đơn hàng của 1 user
    List<DonHang> getOrdersByUserId(Integer userId);

    // Tạo đơn hàng mới (với chi tiết đơn hàng)
    DonHang createOrder(DonHang donHang);

    // Cập nhật đơn hàng
    DonHang updateOrder(Integer id, DonHang donHang);

    // Xóa đơn hàng
    void deleteOrder(Integer id);

    // Lấy đơn hàng mới nhất
    List<DonHang> getLatestOrders();

    // Đếm số đơn hàng của user
    long countOrdersByUserId(Integer userId);
}