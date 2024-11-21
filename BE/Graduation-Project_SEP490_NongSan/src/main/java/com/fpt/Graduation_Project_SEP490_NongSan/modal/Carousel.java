package com.fpt.Graduation_Project_SEP490_NongSan.modal;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Entity
@Data
public class Carousel {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    private String title;

    private String description;

    private String imageUrl;

    private Date createDate;

    @ManyToOne
    @JoinColumn(name = "id_user") // Tham chiếu đến khóa ngoại idUser
    @JsonBackReference
    private User user;
}
