package com.fpt.Graduation_Project_SEP490_NongSan.modal;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Entity
@Data
public class HouseHoldProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_product")
    private Product product;

    @ManyToOne
    @JoinColumn(name = "id_household")
    private HouseHoldRole houseHoldRole;

    private double price;

    @Column(name = "create_date")
    private Date createDate;

}