package com.fpt.Graduation_Project_SEP490_NongSan.payload.request;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class CarouselRequest {

    private String titleCarousel;

    private String descriptionCarousel;

    private MultipartFile imageCarousel;
}
