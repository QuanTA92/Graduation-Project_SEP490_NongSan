package com.fpt.Graduation_Project_SEP490_NongSan.modal;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Entity
@Data
public class PriceMonitoring {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    @ManyToOne
    @JoinColumn(name = "id_subcategory")
    private Subcategory subcategory;

    private double maxPrice;

    private double minPrice;

    private Date createDate;

    private Date updateDate;
}
