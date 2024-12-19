package com.fpt.Graduation_Project_SEP490_NongSan.modal;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Entity
@Getter
@Setter
public class UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    private String phone;

    private String address;

    private String description;

    private Date createDate;

    @OneToOne
    @JoinColumn(name = "id_user")
    @JsonBackReference
    private User user;
}
