package com.fpt.Graduation_Project_SEP490_NongSan.service.imp;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.fpt.Graduation_Project_SEP490_NongSan.exception.FuncErrorException;
import com.fpt.Graduation_Project_SEP490_NongSan.payload.response.CloudinaryResponse;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Service
public class CloudinaryService {

    @Autowired
    private Cloudinary cloudinary;

    @Transactional
    public CloudinaryResponse uploadFile(final MultipartFile file, final String fileName) {
        try {
            final Map result = this.cloudinary.uploader()
                    .upload(file.getBytes(),
                            Map.of("public_id", "tamsdev/product/" + fileName));

            final String url = (String) result.get("secure_url");
            final String publicId = (String) result.get("public_id");
            return CloudinaryResponse.builder().publicId(publicId).url(url).build();
        } catch (final Exception e) {
            // Ghi lại ngoại lệ chi tiết
            e.printStackTrace(); // In ra thông tin chi tiết ra console
            throw new FuncErrorException("Failed to upload file: " + e.getMessage());
        }
    }

    @Transactional
    public void deleteFile(final String publicId) {
        try {
            this.cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        } catch (final Exception e) {
            // Ghi lại ngoại lệ chi tiết
            e.printStackTrace(); // In ra thông tin chi tiết ra console
            throw new FuncErrorException("Failed to delete file: " + e.getMessage());
        }
    }


}
