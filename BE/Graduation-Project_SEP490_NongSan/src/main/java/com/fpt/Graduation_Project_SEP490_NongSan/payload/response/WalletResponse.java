package com.fpt.Graduation_Project_SEP490_NongSan.payload.response;

import lombok.Data;

@Data
public class WalletResponse {

    private int idUser;

    private String nameHouseHold;

    private int bankAccountNumber;

    private String bankName;

    private String registrationLocation;
}