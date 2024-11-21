package com.fpt.Graduation_Project_SEP490_NongSan.payload.request;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class BlogRequest {

    private String title;

    private String content;

    private MultipartFile imageBlog;

}
