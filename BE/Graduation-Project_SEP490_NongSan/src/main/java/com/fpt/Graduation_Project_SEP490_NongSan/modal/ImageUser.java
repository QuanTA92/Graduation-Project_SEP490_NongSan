package com.fpt.Graduation_Project_SEP490_NongSan.modal;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Entity
@Getter
@Setter
public class ImageUser {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    private String cloudinaryImageId;

    @ManyToOne
    @JoinColumn(name = "id_user")
    private User user;

    private String imageUrl;

    private Date createDate;

}
