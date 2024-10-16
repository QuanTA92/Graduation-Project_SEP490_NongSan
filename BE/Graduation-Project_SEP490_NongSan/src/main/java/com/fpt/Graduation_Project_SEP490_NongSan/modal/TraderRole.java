package com.fpt.Graduation_Project_SEP490_NongSan.modal;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Entity
@Data
public class TraderRole {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    @Column(name = "fullname")
    private String fullname;

    private String phone;

    @Column(name = "address")
    private String address;

    @Column(name = "description")
    private String description;

    @Column(name = "tax_id")
    private String taxId;

    @Column(name = "create_date")
    private Date createDate;

    @OneToOne
    @JoinColumn(name = "id_user")
    @JsonBackReference
    private User user;

}
