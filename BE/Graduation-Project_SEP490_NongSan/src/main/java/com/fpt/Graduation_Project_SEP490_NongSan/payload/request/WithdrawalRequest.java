package com.fpt.Graduation_Project_SEP490_NongSan.payload.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WithdrawalRequest {

    private int idOrder;

    private String withdrawalRequest;
}
