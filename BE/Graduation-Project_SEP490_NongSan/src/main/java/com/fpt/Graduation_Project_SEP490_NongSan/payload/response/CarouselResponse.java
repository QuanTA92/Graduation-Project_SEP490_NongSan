package com.fpt.Graduation_Project_SEP490_NongSan.payload.response;

import lombok.Data;

import java.util.Date;

@Data
public class CarouselResponse {

    private String name;

    private int idCarousel;

    private String titleCarousel;

    private String descriptionCarousel;

    private String imageCarousel;

    private Date createDate;
}
