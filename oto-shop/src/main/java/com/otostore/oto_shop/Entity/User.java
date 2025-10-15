package com.otostore.oto_shop.Entity;

import jakarta.persistence.*;
import lombok.*;
import java.sql.Timestamp;
import java.util.List;

@Entity
@Table(name = "user") // ánh xạ vào bảng user
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_user")
    private Integer idUser;

    private String username;
    private String password;
    private String hoten;
    private String email;
    private String phone;
    private String diachi;

    @Enumerated(EnumType.STRING)
    private VaiTro vaitro;

    @Column(name = "ngay_tao")
    private Timestamp ngayTao;

    // 1 user có nhiều đơn hàng
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL) // biến user này là 1 field
    // khi bạn lưu sửa xóa gì với 1 user thì tất cả các DonHang trong DonHangs cũng tác động theo
    private List<DonHang> DonHangs; // DonHangs là nơi chứa tất cả đơn hàng 1 của User
    public enum VaiTro {
        ADMIN, NGUOI_DUNG
    }
}


