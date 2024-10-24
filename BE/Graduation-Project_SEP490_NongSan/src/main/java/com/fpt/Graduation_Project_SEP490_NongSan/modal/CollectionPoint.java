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

    @ManyToOne // Thêm mối quan hệ với User
    @JoinColumn(name = "id_user") // Tên cột khóa ngoại trong bảng CollectionPoint
    private User user;

    @ManyToOne // Add this relationship
    @JoinColumn(name = "id_address") // Assuming you have a foreign key for Address
    private Address address;
}
