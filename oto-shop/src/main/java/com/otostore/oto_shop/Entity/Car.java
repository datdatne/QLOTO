package com.otostore.oto_shop.Entity;

import jakarta.persistence.*; // ánh xạ sang các bảng khác trong csdl
import lombok.*; // sinh tự động getter setter

@Entity // đây là 1 Entity
@Table(name = "car") // ánh xạ vào bảng car
@Getter
@Setter
@NoArgsConstructor // Contructor không tham số
@AllArgsConstructor // Có Tham số
public class Car {

    @Id // khóa chính
    @GeneratedValue(strategy = GenerationType.IDENTITY) // tự động tăng ID cho DB
    @Column(name = "id_car")
    private Integer idCar;
    private String name;
    private Double price;
    private Double sale_price;
    private Integer socho;
    private Integer namsx;
    private String dongco;
    private String hopso;
    @Column(name = "mausac")   // hoặc "mau_sac" nếu DB có gạch dưới
    private String mausac;


    @Enumerated(EnumType.STRING)
    private TinhTrang tinhtrang;

    private String image;

    @Column(name = "ngay_nhap")
    private java.sql.Date ngayNhap;

    @Column(columnDefinition = "TEXT") // mô tả chi tiết kiểu text
    private String mota;

    @ManyToOne // Nhiều Car có tể thuộc 1 Catalog
    @JoinColumn(name = "id_cata") // khóa ngoại trong bảng Car , liên kết với Catalog
    private Catalog catalog;
     public enum TinhTrang {
        Mới  , Cũ
    }

}


