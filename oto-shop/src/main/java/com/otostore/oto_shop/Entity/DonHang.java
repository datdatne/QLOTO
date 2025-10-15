package com.otostore.oto_shop.Entity;

import jakarta.persistence.*;
import lombok.*;
import java.sql.Timestamp;
import java.util.List;

@Entity
@Table(name = "donhang")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DonHang {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_dh")
    private Integer idDh;

    private Double tongdh;

    private String hoten;
    private String email;
    private String phone;
    private String diachi;

    @Column(name = "ngay_dathang")
    private Timestamp ngayDatHang;

    @ManyToOne
    @JoinColumn(name = "id_user")
    private User user;

    // 1 đơn hàng có nhiều chi tiết
    @OneToMany(mappedBy = "donHang", cascade = CascadeType.ALL) /*
    Cái donHang này sẽ là 1 field của DonHangChiTiet mà field là sao :  private DonHang donHang (giống như vậy)
    */
    private List<DonHangChiTiet> donHangChiTiets;
    // donHangChiTiets này là nơi chưa tất cả các donHang của DonHang
}
