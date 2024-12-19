package com.fpt.Graduation_Project_SEP490_NongSan.domain;

import com.fpt.Graduation_Project_SEP490_NongSan.modal.User;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class ForgotPasswordToken {

    @Id
//    @GeneratedValue(strategy = GenerationType.AUTO)
    private String id;

    @OneToOne
    private User user;

    private String otp;

    private VerificationType verificationType;

    private String sendTo;
}
