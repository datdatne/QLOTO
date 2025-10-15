package com.otostore.oto_shop.Entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "donhangchitiet")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DonHangChiTiet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_ctdh")
    private Integer idCtdh;

    private Integer soluong;
    private Double dongia;

    @ManyToOne
    @JoinColumn(name = "id_dh") //khóa ngoại
    private DonHang donHang;

    @ManyToOne
    @JoinColumn(name = "id_car")// khóa ngoại
    private Car car;
}
