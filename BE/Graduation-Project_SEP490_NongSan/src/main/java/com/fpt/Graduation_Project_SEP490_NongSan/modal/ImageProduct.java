package com.fpt.Graduation_Project_SEP490_NongSan.modal;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Entity
@Data
public class ImageProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String cloudinaryImageId;

    @ManyToOne
    @JoinColumn(name = "id_product")
    private Product product;

    private String imageUrl;

    private Date createDate;
}
