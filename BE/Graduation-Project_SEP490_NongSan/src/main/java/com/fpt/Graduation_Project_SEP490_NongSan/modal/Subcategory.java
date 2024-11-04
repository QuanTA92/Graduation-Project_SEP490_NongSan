package com.fpt.Graduation_Project_SEP490_NongSan.modal;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Entity
@Data
public class Subcategory {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    private String name;

    private Date createDate;

    @ManyToOne // Một Subcategory thuộc về một Category
    @JoinColumn(name = "id_categories") // Tên cột khóa ngoại trong bảng Subcategory
    @JsonBackReference // Chỉ định rằng đây là bên không quản lý quan hệ
    private Categories category;

    @OneToMany(mappedBy = "subcategory", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference // Chỉ định rằng đây là bên quản lý quan hệ
    private List<Product> products;

    @OneToMany(mappedBy = "subcategory", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference // Chỉ định rằng đây là bên quản lý quan hệ
    private List<PriceMonitoring> priceMonitorings;
}
