package com.fpt.Graduation_Project_SEP490_NongSan.service;

import com.fpt.Graduation_Project_SEP490_NongSan.domain.VerificationType;
import com.fpt.Graduation_Project_SEP490_NongSan.modal.User;
import com.fpt.Graduation_Project_SEP490_NongSan.payload.request.UserRequest;
import com.fpt.Graduation_Project_SEP490_NongSan.payload.response.UserResponse;

import java.util.List;

public interface UserService {

    public User findUserProfileByJWT(String jwt) throws Exception;

    public UserResponse findUsersProfileByJWT(String jwt) throws Exception;

    public User findUserByEmail(String email) throws Exception;

    public User findUserById(Long userId) throws Exception;

    public User enableTwoFactorAuthentication(VerificationType verificationType, String sendTo, User user);

    User updatePassword(User user, String newPassword);

    boolean updateUser(String jwt, UserRequest userRequest);

    List<UserResponse> getAllUsers(String jwt);

    List<UserResponse> getDetailsUsers(String jwt, String email);
}
