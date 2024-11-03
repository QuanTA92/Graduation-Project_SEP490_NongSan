package com.fpt.Graduation_Project_SEP490_NongSan.config;

import com.cloudinary.Cloudinary;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary cloudinary() {
    final Map<String, String> config = new HashMap<>();
        config.put("cloud_name", "dpupwxfou");
        config.put("api_key", "314235112951541");
        config.put("api_secret", "locsR_ZFV9Hi1sP92eRcsLe7MkQ");
        return new Cloudinary(config);

    }
}
