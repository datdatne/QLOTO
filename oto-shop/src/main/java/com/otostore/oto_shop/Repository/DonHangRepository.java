package com.otostore.oto_shop.Repository;

import com.otostore.oto_shop.Entity.DonHang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DonHangRepository extends JpaRepository<DonHang, Integer> {

    // Lấy tất cả đơn hàng của 1 user
    List<DonHang> findByUser_IdUser(Integer userId);

    // Lấy đơn hàng mới nhất
    @Query("SELECT d FROM DonHang d ORDER BY d.ngayDatHang DESC")
    List<DonHang> findLatestOrders();

    // Đếm số đơn hàng của 1 user
    long countByUser_IdUser(Integer userId);

    // Tìm đơn hàng theo email
    List<DonHang> findByEmailContainingIgnoreCase(String email);

    // Tìm đơn hàng theo số điện thoại
    List<DonHang> findByPhone(String phone);
}