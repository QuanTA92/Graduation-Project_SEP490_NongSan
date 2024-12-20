package com.fpt.Graduation_Project_SEP490_NongSan.payload.request;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class UserRequest {

    private String fullName;

    private String address;

    private String description;

    private String phone;

    private MultipartFile[] userImage;
}
