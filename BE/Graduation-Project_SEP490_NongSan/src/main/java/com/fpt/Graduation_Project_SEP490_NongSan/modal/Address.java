package com.fpt.Graduation_Project_SEP490_NongSan.modal;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
@Entity
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    private String specificAddress;

    private String ward;

    private String district;

    private String city;

    private Date createDate;

    @OneToMany(mappedBy = "address")
    private List<CollectionPoint> collectionPoints;
}
