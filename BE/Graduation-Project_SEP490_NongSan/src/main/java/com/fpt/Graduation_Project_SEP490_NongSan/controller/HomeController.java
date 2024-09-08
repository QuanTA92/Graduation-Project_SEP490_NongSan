package com.fpt.Graduation_Project_SEP490_NongSan.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController

public class HomeController {

    @GetMapping
    public String home(){
        return "Welcome to Graduation Project";
    }

    @GetMapping("/api")
    public String secure(){
        return "Welcome to Graduation Project Secure";
    }
}
