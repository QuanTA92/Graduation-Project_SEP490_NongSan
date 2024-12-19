package com.fpt.Graduation_Project_SEP490_NongSan.service;

import com.fpt.Graduation_Project_SEP490_NongSan.domain.ForgotPasswordToken;
import com.fpt.Graduation_Project_SEP490_NongSan.domain.VerificationType;
import com.fpt.Graduation_Project_SEP490_NongSan.modal.User;

public interface ForgotPasswordService {

    ForgotPasswordToken createToken(User user, String id, String otp, VerificationType verificationType, String sendTo);

    ForgotPasswordToken findById(String id);

    ForgotPasswordToken findByUser(Long userId);

    void deleteToken(ForgotPasswordToken token);

}
