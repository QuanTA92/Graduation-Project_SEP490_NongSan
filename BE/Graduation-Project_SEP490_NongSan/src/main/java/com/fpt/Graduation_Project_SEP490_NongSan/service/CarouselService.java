package com.fpt.Graduation_Project_SEP490_NongSan.service;

import com.fpt.Graduation_Project_SEP490_NongSan.payload.request.CarouselRequest;
import com.fpt.Graduation_Project_SEP490_NongSan.payload.response.CarouselResponse;

import java.util.List;

public interface CarouselService {

    boolean addCarousel(CarouselRequest carouselRequest, String jwt);

    boolean updateCarousel(CarouselRequest carouselRequest, int idCarousel, String jwt);

    boolean deleteCarousel(int idCarousel, String jwt);

    List<CarouselResponse> getAllCarousel();

    CarouselResponse getCarouselById(int idCarousel);
}

