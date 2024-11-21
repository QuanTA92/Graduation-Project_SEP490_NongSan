package com.fpt.Graduation_Project_SEP490_NongSan.service.imp;

import com.fpt.Graduation_Project_SEP490_NongSan.modal.Carousel;
import com.fpt.Graduation_Project_SEP490_NongSan.modal.User;
import com.fpt.Graduation_Project_SEP490_NongSan.payload.request.CarouselRequest;
import com.fpt.Graduation_Project_SEP490_NongSan.payload.response.CarouselResponse;
import com.fpt.Graduation_Project_SEP490_NongSan.payload.response.CloudinaryResponse;
import com.fpt.Graduation_Project_SEP490_NongSan.repository.CarouselRepository;
import com.fpt.Graduation_Project_SEP490_NongSan.repository.UserRepository;
import com.fpt.Graduation_Project_SEP490_NongSan.service.CarouselService;
import com.fpt.Graduation_Project_SEP490_NongSan.utils.UserUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
public class CarouselServiceImpl implements CarouselService {

    @Autowired
    private CloudinaryService cloudinaryService;

    @Autowired
    private UserUtil userUtil;

    @Autowired
    private CarouselRepository carouselRepository;

    @Autowired
    private UserRepository userRepository;

    private User getAuthenticatedUser() {
        int userId = userUtil.getUserIdFromToken();
        return userRepository.findById((long) userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private void populateCarousel(Carousel carousel, CarouselRequest request, String imageUrl) {
        carousel.setTitle(request.getTitleCarousel());
        carousel.setDescription(request.getDescriptionCarousel());
        if (imageUrl != null) carousel.setImageUrl(imageUrl);
        carousel.setCreateDate(new Date());
    }

    @Override
    public boolean addCarousel(CarouselRequest carouselRequest, String jwt) {
        try {
            User user = getAuthenticatedUser();
            String fileName = carouselRequest.getImageCarousel().getOriginalFilename();
            String imageUrl = cloudinaryService.uploadFile(carouselRequest.getImageCarousel(), fileName).getUrl();

            Carousel carousel = new Carousel();
            populateCarousel(carousel, carouselRequest, imageUrl);
            carousel.setUser(user);

            carouselRepository.save(carousel);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public boolean updateCarousel(CarouselRequest carouselRequest, int idCarousel, String jwt) {
        try {
            Carousel existingCarousel = carouselRepository.findById(idCarousel)
                    .orElseThrow(() -> new RuntimeException("Carousel not found"));

            if (carouselRequest.getImageCarousel() != null && !carouselRequest.getImageCarousel().isEmpty()) {
                String fileName = carouselRequest.getImageCarousel().getOriginalFilename();
                String imageUrl = cloudinaryService.uploadFile(carouselRequest.getImageCarousel(), fileName).getUrl();
                populateCarousel(existingCarousel, carouselRequest, imageUrl);
            } else {
                populateCarousel(existingCarousel, carouselRequest, null);
            }

            carouselRepository.save(existingCarousel);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public boolean deleteCarousel(int idCarousel, String jwt) {
        try {
            User user = getAuthenticatedUser();
            Carousel carousel = carouselRepository.findById(idCarousel)
                    .orElseThrow(() -> new RuntimeException("Carousel not found"));

            if (!carousel.getUser().getId().equals(user.getId())) {
                throw new RuntimeException("You do not have permission to delete this carousel");
            }

            carouselRepository.deleteById(idCarousel);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public List<CarouselResponse> getAllCarousel() {
        try {
            return StreamSupport.stream(carouselRepository.findAll().spliterator(), false)
                    .map(this::toCarouselResponse)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            e.printStackTrace();
            return List.of();
        }
    }

    @Override
    public CarouselResponse getCarouselById(int idCarousel) {
        Carousel carousel = carouselRepository.findById(idCarousel).orElse(null);
        if (carousel != null) {
            return toCarouselResponse(carousel);
        } else {
            return null;
        }
    }

    private CarouselResponse toCarouselResponse(Carousel carousel) {
        CarouselResponse response = new CarouselResponse();
        response.setName(carousel.getUser().getFullname());
        response.setIdCarousel(carousel.getId());
        response.setTitleCarousel(carousel.getTitle());
        response.setDescriptionCarousel(carousel.getDescription());
        response.setImageCarousel(carousel.getImageUrl());
        response.setCreateDate(carousel.getCreateDate());
        return response;
    }
}
