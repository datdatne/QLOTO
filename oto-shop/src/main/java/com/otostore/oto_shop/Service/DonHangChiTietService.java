package com.otostore.oto_shop.Service;

public interface DonHangChiTietService {
    // Lấy tổng số lượng TẤT CẢ xe đã bán
    Long getTotalCarsSold();

    // Lấy tổng số lượng của 1 xe cụ thể đã bán
    Long getTotalSoldByCarId(Integer carId);
}
