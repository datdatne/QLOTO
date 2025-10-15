package com.otostore.oto_shop.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "car")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Car {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_car")
    private Integer idCar;

    private String name;
    private Double price;
    private Double sale_price;
    private Integer socho;
    private Integer namsx;
    private String dongco;
    private String hopso;

    @Column(name = "mausac")
    private String mausac;

    @Enumerated(EnumType.STRING)
    private TinhTrang tinhtrang;

    private String image;

    @Column(name = "ngay_nhap")
    private java.sql.Date ngayNhap;

    @Column(columnDefinition = "TEXT")
    private String mota;

    @ManyToOne
    @JoinColumn(name = "id_cata")
    private Catalog catalog;

    // ← THÊM QUAN HỆ NGƯỢC VỚI DonHangChiTiet
    @OneToMany(mappedBy = "car")
    @JsonIgnore // ← QUAN TRỌNG: BỎ QUA KHI SERIALIZE
    private List<DonHangChiTiet> donHangChiTiets;

    public enum TinhTrang {
        Mới, Cũ
    }
}