package com.fpt.Graduation_Project_SEP490_NongSan.payload.response;

import lombok.Data;

@Data
public class AuthResponse {

    private String jwt;

    private boolean status;

    private String message;

    private boolean isTwoFactorAuthEnabled;

    private String seesion;

}
