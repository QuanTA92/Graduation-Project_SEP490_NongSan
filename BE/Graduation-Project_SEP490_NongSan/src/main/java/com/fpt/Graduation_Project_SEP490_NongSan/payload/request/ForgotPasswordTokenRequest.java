package com.fpt.Graduation_Project_SEP490_NongSan.payload.request;

import com.fpt.Graduation_Project_SEP490_NongSan.domain.VerificationType;
import lombok.Data;

@Data
public class ForgotPasswordTokenRequest {

    private String sendTo;

    private VerificationType verificationType;
}
