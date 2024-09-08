package com.fpt.Graduation_Project_SEP490_NongSan.modal;

import com.fpt.Graduation_Project_SEP490_NongSan.domain.VerificationType;
import lombok.Data;

@Data
public class TwoFactorAuth {
    private boolean isEnabled = false;

    private VerificationType sendTo;

}
