package com.fpt.Graduation_Project_SEP490_NongSan.service.imp;

import com.fpt.Graduation_Project_SEP490_NongSan.modal.Blog;
import com.fpt.Graduation_Project_SEP490_NongSan.modal.User;
import com.fpt.Graduation_Project_SEP490_NongSan.payload.request.BlogRequest;
import com.fpt.Graduation_Project_SEP490_NongSan.payload.response.BlogResponse;
import com.fpt.Graduation_Project_SEP490_NongSan.repository.BlogRepository;
import com.fpt.Graduation_Project_SEP490_NongSan.repository.UserRepository;
import com.fpt.Graduation_Project_SEP490_NongSan.service.BlogService;
import com.fpt.Graduation_Project_SEP490_NongSan.utils.UserUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class BlogServiceImpl implements BlogService {

    @Autowired
    private BlogRepository blogRepository;;

    @Autowired
    private UserUtil userUtil;

    @Autowired
    private CloudinaryService cloudinaryService;

    @Autowired
    private UserRepository userRepository;

    @Override
    public boolean addBlog(BlogRequest blogRequest, String jwt) {
        try {
            // Lấy thông tin người dùng đang xác thực
            User user = getAuthenticatedUser();

            // Upload ảnh blog lên Cloudinary
            String fileName = blogRequest.getImageBlog().getOriginalFilename();
            String imageUrl = cloudinaryService.uploadFile(blogRequest.getImageBlog(), fileName).getUrl();

            // Tạo đối tượng Blog mới
            Blog blog = new Blog();
            blog.setTitle(blogRequest.getTitle());
            blog.setContent(blogRequest.getContent());
            blog.setImageUrl(imageUrl);
            blog.setCreateDate(new Date());
            blog.setUser(user);

            // Lưu blog vào cơ sở dữ liệu
            blogRepository.save(blog);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public boolean updateBlog(BlogRequest blogRequest, String jwt, int idBlog) {
        try {
            // Tìm blog cần cập nhật
            Blog existingBlog = blogRepository.findById(idBlog)
                    .orElseThrow(() -> new RuntimeException("Blog not found"));

            // Nếu có ảnh mới, upload ảnh lên Cloudinary và cập nhật URL
            if (blogRequest.getImageBlog() != null && !blogRequest.getImageBlog().isEmpty()) {
                String fileName = blogRequest.getImageBlog().getOriginalFilename();
                String imageUrl = cloudinaryService.uploadFile(blogRequest.getImageBlog(), fileName).getUrl();
                existingBlog.setImageUrl(imageUrl);
            }

            // Cập nhật thông tin khác của blog
            existingBlog.setTitle(blogRequest.getTitle());
            existingBlog.setContent(blogRequest.getContent());
            existingBlog.setCreateDate(new Date()); // Có thể bỏ qua nếu không muốn cập nhật ngày tạo

            // Lưu blog sau khi cập nhật
            blogRepository.save(existingBlog);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    // Phương thức hỗ trợ: lấy thông tin người dùng từ JWT
    private User getAuthenticatedUser() {
        int userId = userUtil.getUserIdFromToken();
        return userRepository.findById((long) userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }


    @Override
    public boolean deleteBlog(int idBlog) {
        try {
            // Tìm blog theo ID
            Blog blog = blogRepository.findById(idBlog)
                    .orElseThrow(() -> new RuntimeException("Blog not found"));

            // Xóa blog khỏi cơ sở dữ liệu
            blogRepository.delete(blog);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public List<BlogResponse> getAllBlog() {
        try {
            // Lấy tất cả các blog từ cơ sở dữ liệu
            List<Blog> blogs = blogRepository.findAll();

            // Chuyển đổi danh sách Blog thành danh sách BlogResponse
            return blogs.stream().map(blog -> {
                BlogResponse response = new BlogResponse();
                response.setIdBlog(blog.getId());
                response.setTitleBlog(blog.getTitle());
                response.setContentBlog(blog.getContent());
                response.setImageBlog(blog.getImageUrl());
                response.setCreateDate(blog.getCreateDate());
                response.setAuthor(blog.getUser().getFullname());
                return response;
            }).toList();
        } catch (Exception e) {
            e.printStackTrace();
            return List.of();
        }
    }

    @Override
    public List<BlogResponse> getBlogById(int idBlog) {
        try {
            // Tìm blog theo ID
            Blog blog = blogRepository.findById(idBlog)
                    .orElseThrow(() -> new RuntimeException("Blog not found"));

            // Chuyển đổi Blog thành BlogResponse
            BlogResponse response = new BlogResponse();
            response.setIdBlog(blog.getId());
            response.setTitleBlog(blog.getTitle());
            response.setContentBlog(blog.getContent());
            response.setImageBlog(blog.getImageUrl());
            response.setCreateDate(blog.getCreateDate());
            response.setAuthor(blog.getUser().getFullname());

            return List.of(response);
        } catch (Exception e) {
            e.printStackTrace();
            return List.of();
        }
    }

}
