package com.fpt.Graduation_Project_SEP490_NongSan.utils;

import com.fpt.Graduation_Project_SEP490_NongSan.modal.User;
import com.fpt.Graduation_Project_SEP490_NongSan.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class UserUtil {

    private static UserRepository userRepository;

    @Autowired
    public UserUtil(UserRepository userRepository) {
        UserUtil.userRepository = userRepository;
    }

    public static int getUserIdFromToken() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getName() != null) {
            String email = auth.getName();
            User user = userRepository.findByEmail(email);
            if (user != null) {
                return Math.toIntExact(user.getId()); // Return user ID
            }
        }
        throw new RuntimeException("Could not retrieve user ID from token");
    }
}
