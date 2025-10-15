package com.otostore.oto_shop.Repository;

import com.otostore.oto_shop.Entity.DonHangChiTiet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DonHangChiTietRepository extends JpaRepository<DonHangChiTiet, Integer> {

    // Lấy tất cả chi tiết theo id đơn hàng
    List<DonHangChiTiet> findByDonHang_IdDh(Integer idDh);

    // Lấy tất cả chi tiết theo id sản phẩm (Car)
    List<DonHangChiTiet> findByCar_IdCar(Integer id);


    // Ví dụ: tìm theo số lượng lớn hơn X
    List<DonHangChiTiet> findBySoluongGreaterThan(Integer soluong);
}
