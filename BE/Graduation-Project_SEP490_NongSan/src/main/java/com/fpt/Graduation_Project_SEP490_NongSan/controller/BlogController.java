package com.fpt.Graduation_Project_SEP490_NongSan.controller;

import com.fpt.Graduation_Project_SEP490_NongSan.payload.request.BlogRequest;
import com.fpt.Graduation_Project_SEP490_NongSan.payload.response.BlogResponse;
import com.fpt.Graduation_Project_SEP490_NongSan.service.BlogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin
@RestController
@RequestMapping("/api/blog")
public class BlogController {

    @Autowired
    private BlogService blogService;

    @PostMapping("/add")
    public ResponseEntity<?> addBlog(@ModelAttribute BlogRequest blogRequest, @RequestHeader("Authorization") String jwt) {
        boolean result = blogService.addBlog(blogRequest, jwt);
        if (result) {
            return new ResponseEntity<>("Blog added successfully", HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>("Failed to add blog", HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/update/{idBlog}")
    public ResponseEntity<?> updateBlog(@ModelAttribute BlogRequest blogRequest, @RequestHeader("Authorization") String jwt, @PathVariable int idBlog) {
        boolean result = blogService.updateBlog(blogRequest, jwt, idBlog);
        if (result) {
            return new ResponseEntity<>("Blog updated successfully", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Failed to update blog", HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/delete/{idBlog}")
    public ResponseEntity<?> deleteBlog(@PathVariable int idBlog) {
        boolean result = blogService.deleteBlog(idBlog);
        if (result) {
            return new ResponseEntity<>("Blog deleted successfully", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Failed to delete blog", HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/get")
    public ResponseEntity<?> getAllBlog() {
        List<BlogResponse> blogs = blogService.getAllBlog();
        if (!blogs.isEmpty()) {
            return new ResponseEntity<>(blogs, HttpStatus.OK);
        } else {
            return new ResponseEntity<>("No blogs found", HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/get/{idBlog}")
    public ResponseEntity<?> getAllBlogById(@PathVariable int idBlog) {
        List<BlogResponse> blog = blogService.getBlogById(idBlog);
        if (!blog.isEmpty()) {
            return new ResponseEntity<>(blog.get(0), HttpStatus.OK); // Trả về đối tượng đầu tiên vì chỉ có 1 blog
        } else {
            return new ResponseEntity<>("Blog not found", HttpStatus.NOT_FOUND);
        }
    }




}
