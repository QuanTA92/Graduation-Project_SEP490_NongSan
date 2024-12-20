package com.fpt.Graduation_Project_SEP490_NongSan.payload.response;

import lombok.Data;

import java.util.List;

@Data
public class UserResponse {

    private String email;

    private String fullName;

    private String phone;

    private String address;

    private String description;

    private String nameRole;

    private List<String> imageUser;
}
