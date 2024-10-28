package com.fpt.Graduation_Project_SEP490_NongSan.payload.request;

import lombok.Data;

@Data
public class AuthRequest {

    private String fullname;

    private String email;

    private String password;

    private String role;

}
