package com.fpt.Graduation_Project_SEP490_NongSan.modal;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Entity
@Data
public class HouseHoldProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    @ManyToOne
    @JoinColumn(name = "id_product")
    private Product product;

    @ManyToOne // Thêm mối quan hệ với User
    @JoinColumn(name = "id_user") // Tên cột khóa ngoại trong bảng HouseHoldProduct
    private User user;

    private int price;

    @Column(name = "create_date")
    private Date createDate;


}