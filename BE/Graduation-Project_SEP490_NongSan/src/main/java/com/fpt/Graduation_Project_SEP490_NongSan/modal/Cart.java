package com.fpt.Graduation_Project_SEP490_NongSan.modal;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
@Entity
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    @ManyToOne // Không thay đổi
    @JoinColumn(name = "id_user")
    private User user;

    @ManyToOne
    @JoinColumn(name = "id_product")
    private Product product;

    private int quantity;

    private Date createDate;
}
