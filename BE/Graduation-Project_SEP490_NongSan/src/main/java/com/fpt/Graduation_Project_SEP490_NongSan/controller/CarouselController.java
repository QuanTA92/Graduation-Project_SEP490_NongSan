package com.fpt.Graduation_Project_SEP490_NongSan.controller;

import com.fpt.Graduation_Project_SEP490_NongSan.exception.FuncErrorException;
import com.fpt.Graduation_Project_SEP490_NongSan.payload.request.CarouselRequest;
import com.fpt.Graduation_Project_SEP490_NongSan.payload.response.CarouselResponse;
import com.fpt.Graduation_Project_SEP490_NongSan.service.CarouselService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin
@RestController
@RequestMapping("/api/carousel")
public class CarouselController {

    @Autowired
    private CarouselService carouselService;

    @PostMapping("/add")
    public ResponseEntity<String> addCarousel(@ModelAttribute CarouselRequest carouselRequest, @RequestHeader("Authorization") String jwt) {
        try {
            boolean isAdded = carouselService.addCarousel(carouselRequest, jwt);
            if (isAdded) {
                return new ResponseEntity<>("Carousel added successfully", HttpStatus.CREATED);
            } else {
                return new ResponseEntity<>("Failed to add carousel", HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } catch (FuncErrorException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("An unexpected error occurred: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/update/{idCarousel}")
    public ResponseEntity<String> updateCarousel(@PathVariable int idCarousel, @ModelAttribute CarouselRequest carouselRequest, @RequestHeader("Authorization") String jwt) {
        try {
            boolean isUpdated = carouselService.updateCarousel(carouselRequest, idCarousel, jwt);
            if (isUpdated) {
                return ResponseEntity.ok("Carousel updated successfully.");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Failed to update carousel or carousel not found.");
            }
        } catch (FuncErrorException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("An unexpected error occurred: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/delete/{idCarousel}")
    public ResponseEntity<String> deleteCarousel(@PathVariable int idCarousel, @RequestHeader("Authorization") String jwt) {
        try {
            boolean isDeleted = carouselService.deleteCarousel(idCarousel, jwt);
            if (isDeleted) {
                return ResponseEntity.ok("Carousel deleted successfully.");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Failed to delete carousel or carousel not found.");
            }
        } catch (FuncErrorException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("An unexpected error occurred: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/get")
    public ResponseEntity<List<CarouselResponse>> getAllCarousels() {
        try {
            List<CarouselResponse> carousels = carouselService.getAllCarousel();
            return ResponseEntity.ok(carousels);
        } catch (Exception e) {
            return new ResponseEntity<>(List.of(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/get/{idCarousel}")
    public ResponseEntity<CarouselResponse> getCarouselById(@PathVariable int idCarousel) {
        try {
            CarouselResponse carousel = carouselService.getCarouselById(idCarousel);
            if (carousel != null) {
                return ResponseEntity.ok(carousel);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }





}
