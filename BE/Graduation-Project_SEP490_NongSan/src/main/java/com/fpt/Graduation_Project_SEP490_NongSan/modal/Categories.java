package com.fpt.Graduation_Project_SEP490_NongSan.modal;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Entity
@Data
public class Categories {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    private String name;

    private Date createDate;

    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference // Chỉ định rằng đây là bên quản lý quan hệ
    private List<Subcategory> subcategories;
}
