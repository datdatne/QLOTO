package com.otostore.oto_shop.Service;

import com.otostore.oto_shop.Repository.DonHangChiTietRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DonHangChiTietServiceImpl implements DonHangChiTietService {

    @Autowired
    private DonHangChiTietRepository donHangChiTietRepository;

    @Override
    public Long getTotalCarsSold() {
        return donHangChiTietRepository.getTotalCarsSold();
    }

    @Override
    public Long getTotalSoldByCarId(Integer carId) {
        return donHangChiTietRepository.getTotalSoldByCarId(carId);
    }
}