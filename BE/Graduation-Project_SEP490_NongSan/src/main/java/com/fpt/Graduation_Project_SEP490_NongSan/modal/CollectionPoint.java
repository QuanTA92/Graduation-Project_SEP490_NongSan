package com.fpt.Graduation_Project_SEP490_NongSan.modal;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Data
@Entity
public class CollectionPoint {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

//    private int idHouseHold;

    private Date createDate;

    private Date updateDate;

    private String description;

    private String status;

    @ManyToOne
    @JoinColumn(name = "id_household") // Assuming it refers to the household
    private HouseHoldRole houseHoldRole;

    @ManyToOne // Add this relationship
    @JoinColumn(name = "id_address") // Assuming you have a foreign key for Address
    private Address address;
}
