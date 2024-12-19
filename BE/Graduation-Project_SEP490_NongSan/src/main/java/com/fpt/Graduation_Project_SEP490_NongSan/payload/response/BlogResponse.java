package com.fpt.Graduation_Project_SEP490_NongSan.payload.response;

import lombok.Data;

import java.util.Date;

@Data
public class BlogResponse {

    private int idBlog;

    private String author;

    private String titleBlog;

    private String contentBlog;

    private String imageBlog;

    private Date createDate;
}
