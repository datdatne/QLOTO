package com.otostore.oto_shop.Service;

import com.otostore.oto_shop.Entity.DonHang;
import com.otostore.oto_shop.Entity.DonHangChiTiet;
import com.otostore.oto_shop.Exception.ResourceNotFoundException;
import com.otostore.oto_shop.Repository.DonHangRepository;
import com.otostore.oto_shop.Service.DonHangService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

@Service
public class DonHangServiceImpl implements DonHangService {

    @Autowired
    private DonHangRepository donHangRepository;

    @Override
    public List<DonHang> getAllOrders() {
        return donHangRepository.findAll();
    }

    @Override
    public Optional<DonHang> getOrderById(Integer id) {
        return donHangRepository.findById(id);
    }

    @Override
    public List<DonHang> getOrdersByUserId(Integer userId) {
        return donHangRepository.findByUser_IdUser(userId);
    }

    @Override
    public DonHang createOrder(DonHang donHang) {
        // Set thời gian đặt hàng
        if (donHang.getNgayDatHang() == null) {
            donHang.setNgayDatHang(new Timestamp(System.currentTimeMillis()));
        }

        // Tính tổng tiền đơn hàng từ chi tiết
        if (donHang.getDonHangChiTiets() != null && !donHang.getDonHangChiTiets().isEmpty()) {
            double total = 0;
            for (DonHangChiTiet chiTiet : donHang.getDonHangChiTiets()) {
                // Thiết lập quan hệ 2 chiều
                chiTiet.setDonHang(donHang);
                total += chiTiet.getDongia() * chiTiet.getSoluong();
            }
            donHang.setTongdh(total);
        }

        return donHangRepository.save(donHang);
    }

    @Override
    public DonHang updateOrder(Integer id, DonHang donHang) {
        Optional<DonHang> existingOrder = donHangRepository.findById(id);
        if (!existingOrder.isPresent()) {
            throw new ResourceNotFoundException("DonHang", "id", id);
        }

        donHang.setIdDh(id);
        return donHangRepository.save(donHang);
    }

    @Override
    public void deleteOrder(Integer id) {
        Optional<DonHang> donHang = donHangRepository.findById(id);
        if (!donHang.isPresent()) {
            throw new ResourceNotFoundException("DonHang", "id", id);
        }
        donHangRepository.deleteById(id);
    }

    @Override
    public List<DonHang> getLatestOrders() {
        return donHangRepository.findLatestOrders();
    }

    @Override
    public long countOrdersByUserId(Integer userId) {
        return donHangRepository.countByUser_IdUser(userId);
    }
}