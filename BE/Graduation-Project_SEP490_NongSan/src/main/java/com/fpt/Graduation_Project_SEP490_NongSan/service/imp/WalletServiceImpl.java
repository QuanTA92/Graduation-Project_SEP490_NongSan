package com.fpt.Graduation_Project_SEP490_NongSan.service.imp;

import com.fpt.Graduation_Project_SEP490_NongSan.modal.User;
import com.fpt.Graduation_Project_SEP490_NongSan.modal.Wallet;
import com.fpt.Graduation_Project_SEP490_NongSan.payload.request.WalletRequest;
import com.fpt.Graduation_Project_SEP490_NongSan.payload.response.WalletResponse;
import com.fpt.Graduation_Project_SEP490_NongSan.repository.UserRepository;
import com.fpt.Graduation_Project_SEP490_NongSan.repository.WalletRepository;
import com.fpt.Graduation_Project_SEP490_NongSan.service.WalletService;
import com.fpt.Graduation_Project_SEP490_NongSan.utils.UserUtil;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class WalletServiceImpl implements WalletService {

    @Autowired
    private WalletRepository walletRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserUtil userUtil;

    @Override
    public boolean addWallet(String jwt, WalletRequest walletRequest) {
        try {
            int userId = userUtil.getUserIdFromToken();
            Optional<User> userOpt = userRepository.findById((long) userId);

            if (userOpt.isPresent()) {
                Wallet wallet = new Wallet();
                wallet.setUser(userOpt.get());
                wallet.setBank_account_number(walletRequest.getBankAccountNumber());
                wallet.setBank_name(walletRequest.getBankName());
                wallet.setRegistration_location(walletRequest.getRegistrationLocation());
                walletRepository.save(wallet);
                return true;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    @Override
    public boolean updateWallet(String jwt, WalletRequest walletRequest) {
        try {
            int userId = userUtil.getUserIdFromToken();
            Optional<Wallet> walletOpt = walletRepository.findByUserId(userId);

            if (walletOpt.isPresent()) {
                Wallet wallet = walletOpt.get();
                wallet.setBank_account_number(walletRequest.getBankAccountNumber());
                wallet.setBank_name(walletRequest.getBankName());
                wallet.setRegistration_location(walletRequest.getRegistrationLocation());
                walletRepository.save(wallet);
                return true;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    @Transactional
    @Override
    public boolean deleteWallet(String jwt) {
        try {
            int userId = userUtil.getUserIdFromToken();
            Optional<Wallet> walletOpt = walletRepository.findByUserId(userId);

            if (walletOpt.isPresent()) {
                System.out.println("Deleting wallet: " + walletOpt.get().getId());
                walletRepository.delete(walletOpt.get());
                System.out.println("Wallet deleted.");
                return true;
            } else {
                System.out.println("No wallet found for user ID: " + userId);
            }
        } catch (Exception e) {
            System.err.println("Error deleting wallet: " + e.getMessage());
            e.printStackTrace();
        }
        return false;
    }

    @Override
    public List<WalletResponse> getWalletForAccountHouseHold(String jwt) {
        try {
            int userId = userUtil.getUserIdFromToken();
            Optional<Wallet> wallets = walletRepository.findByUserId(userId);

            if (wallets.isEmpty()) {
                System.out.println("No wallets found for user ID: " + userId);
                return List.of(); // Trả về danh sách rỗng nếu không tìm thấy ví
            }

            return wallets.stream()
                    .map(wallet -> {
                        WalletResponse response = new WalletResponse();
                        response.setIdUser(userId);
                        response.setNameHouseHold(wallet.getUser().getFullname());
                        response.setBankAccountNumber(wallet.getBank_account_number());
                        response.setBankName(wallet.getBank_name());
                        response.setRegistrationLocation(wallet.getRegistration_location());
                        return response;
                    })
                    .toList();
        } catch (Exception e) {
            System.err.println("Error retrieving wallets for user: " + e.getMessage());
            e.printStackTrace();
            return List.of(); // Trả về danh sách rỗng trong trường hợp có lỗi
        }
    }

    @Override
    public List<WalletResponse> getAllWallets() {
        try {
            List<Wallet> wallets = walletRepository.findAll();

            if (wallets.isEmpty()) {
                System.out.println("No wallets found in the database.");
                return List.of(); // Trả về danh sách rỗng nếu không có ví
            }

            return wallets.stream()
                    .map(wallet -> {
                        WalletResponse response = new WalletResponse();
                        response.setIdUser(Math.toIntExact(wallet.getUser().getId())); // Lấy ID người dùng từ ví
                        response.setNameHouseHold(wallet.getUser().getFullname());
                        response.setBankAccountNumber(wallet.getBank_account_number());
                        response.setBankName(wallet.getBank_name());
                        response.setRegistrationLocation(wallet.getRegistration_location());
                        return response;
                    })
                    .toList();
        } catch (Exception e) {
            System.err.println("Error retrieving all wallets: " + e.getMessage());
            e.printStackTrace();
            return List.of(); // Trả về danh sách rỗng trong trường hợp có lỗi
        }
    }

    @Override
    public List<WalletResponse> getWalletAccountDetailsByIdWallet(int idWallet) {
        try {
            Optional<Wallet> walletOpt = walletRepository.findById(idWallet);

            if (walletOpt.isPresent()) {
                Wallet wallet = walletOpt.get();
                WalletResponse response = new WalletResponse();
                response.setIdUser(Math.toIntExact(wallet.getUser().getId())); // Lấy ID người dùng từ ví
                response.setNameHouseHold(wallet.getUser().getFullname());
                response.setBankAccountNumber(wallet.getBank_account_number());
                response.setBankName(wallet.getBank_name());
                response.setRegistrationLocation(wallet.getRegistration_location());
                return List.of(response); // Trả về danh sách chỉ với một phần tử
            } else {
                System.out.println("No wallet found for ID: " + idWallet);
            }
        } catch (Exception e) {
            System.err.println("Error retrieving wallet details: " + e.getMessage());
            e.printStackTrace();
        }
        return List.of(); // Trả về danh sách rỗng nếu không tìm thấy ví hoặc có lỗi
    }

    @Override
    public boolean checkWalletCreatedOrNot(String jwt) {
        try {
            int userId = userUtil.getUserIdFromToken();
            Optional<Wallet> walletOpt = walletRepository.findByUserId(userId);

            return walletOpt.isPresent(); // Trả về true nếu ví đã tồn tại, false nếu chưa
        } catch (Exception e) {
            e.printStackTrace();
            return false; // Trong trường hợp có lỗi, trả về false
        }
    }



}
