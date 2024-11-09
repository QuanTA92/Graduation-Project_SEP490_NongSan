package com.fpt.Graduation_Project_SEP490_NongSan.service;

import com.fpt.Graduation_Project_SEP490_NongSan.payload.request.WalletRequest;
import com.fpt.Graduation_Project_SEP490_NongSan.payload.response.WalletResponse;

import java.util.List;

public interface WalletService {

    boolean addWallet(String jwt, WalletRequest walletRequest);

    boolean updateWallet(String jwt, WalletRequest walletRequest);

    boolean deleteWallet(String jwt);

    List<WalletResponse> getWalletForAccountHouseHold(String jwt);

    List<WalletResponse> getAllWallets();

    List<WalletResponse> getWalletAccountDetailsByIdWallet(int idWallet);

    boolean checkWalletCreatedOrNot(String jwt);
}
