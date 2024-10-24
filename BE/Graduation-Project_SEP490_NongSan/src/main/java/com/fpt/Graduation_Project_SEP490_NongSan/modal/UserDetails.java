package com.fpt.Graduation_Project_SEP490_NongSan.modal;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Entity
@Data
public class UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    private String phone;

    private String address;

    private String description;

    private Date createDate;

    // Quan hệ một - một với bảng User
    @OneToOne
    @JoinColumn(name = "id_user") // Tham chiếu đến khóa ngoại idUser
    @JsonBackReference
    private User user;
}
