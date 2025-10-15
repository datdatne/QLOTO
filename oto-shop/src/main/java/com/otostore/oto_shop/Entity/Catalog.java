package com.otostore.oto_shop.Entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "catalog")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Catalog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cata")
    private Integer idCata;

    @Column(name = "name", length = 100)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String mota;
}
