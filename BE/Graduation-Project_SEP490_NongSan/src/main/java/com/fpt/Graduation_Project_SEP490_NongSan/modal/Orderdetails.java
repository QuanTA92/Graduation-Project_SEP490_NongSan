package com.fpt.Graduation_Project_SEP490_NongSan.modal;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Data
@Entity
public class Orderdetails {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    private int price;

    private int quantity;

    private Date createDate;

    @ManyToOne // Quan hệ nhiều - một với Orders
    @JoinColumn(name = "id_order") // Khóa ngoại đến bảng Orders
    private Orders order;

    @ManyToOne // Quan hệ nhiều - một với Product
    @JoinColumn(name = "id_product") // Khóa ngoại đến bảng Product
    private Product product;

}
