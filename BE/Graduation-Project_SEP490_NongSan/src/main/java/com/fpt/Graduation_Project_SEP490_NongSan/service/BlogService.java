package com.fpt.Graduation_Project_SEP490_NongSan.service;

import com.fpt.Graduation_Project_SEP490_NongSan.payload.request.BlogRequest;
import com.fpt.Graduation_Project_SEP490_NongSan.payload.response.BlogResponse;

import java.util.List;

public interface BlogService {

    boolean addBlog(BlogRequest blogRequest, String jwt);

    boolean updateBlog(BlogRequest blogRequest, String jwt, int idBlog);

    boolean deleteBlog(int idBlog);

    List<BlogResponse> getAllBlog();

    List<BlogResponse> getBlogById(int idBlog);
}
