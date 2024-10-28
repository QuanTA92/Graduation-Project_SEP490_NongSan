package com.fpt.Graduation_Project_SEP490_NongSan.modal;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Data
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String name;

    @Column(name = "quality_check")
    private String qualityCheck;

    private String description;

    @Column(name = "expiration_date")
    private Date expirationDate;

    @ManyToOne // Mỗi Product thuộc về một Subcategory
    @JoinColumn(name = "id_subcategory") // Tên cột khóa ngoại trong bảng Product
    @JsonBackReference // Chỉ định rằng đây là bên không quản lý quan hệ
    private Subcategory subcategory;

    private int quantity;

    @Column(name = "created_at")
    private Date createdAt;

    @Column(name = "updated_at")
    private Date updatedAt;

    @OneToMany(mappedBy = "product")
    private List<HouseHoldProduct> houseHoldProducts;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ImageProduct> imageProducts = new ArrayList<>();

    @ManyToOne // Add this relationship
    @JoinColumn(name = "id_address") // Assuming you have a foreign key for Address
    private Address address;

}
