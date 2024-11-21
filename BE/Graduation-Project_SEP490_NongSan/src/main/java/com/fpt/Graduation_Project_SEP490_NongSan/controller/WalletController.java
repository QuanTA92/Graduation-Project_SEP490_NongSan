package com.fpt.Graduation_Project_SEP490_NongSan.controller;

import com.fpt.Graduation_Project_SEP490_NongSan.payload.request.WalletRequest;
import com.fpt.Graduation_Project_SEP490_NongSan.service.WalletService;
import jakarta.persistence.Id;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/wallet")
public class WalletController {

    @Autowired
    private WalletService walletService;

    @PostMapping("/add")
    public ResponseEntity<String> addWallet(@RequestHeader("Authorization") String jwt, @RequestBody WalletRequest walletRequest) {
        boolean isAdded = walletService.addWallet(jwt, walletRequest);
        if (isAdded) {
            return ResponseEntity.ok("Wallet added successfully.");
        } else {
            return ResponseEntity.badRequest().body("Failed to add wallet.");
        }
    }

    @PutMapping("/update")
    public ResponseEntity<String> updateWallet(@RequestHeader("Authorization") String jwt, @RequestBody WalletRequest walletRequest) {
        boolean isUpdated = walletService.updateWallet(jwt, walletRequest);
        if (isUpdated) {
            return ResponseEntity.ok("Wallet updated successfully.");
        } else {
            return ResponseEntity.badRequest().body("Failed to update wallet.");
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteWallet(@RequestHeader("Authorization") String jwt) {
        boolean isDeleted = walletService.deleteWallet(jwt);
        if (isDeleted) {
            return ResponseEntity.ok("Wallet deleted successfully.");
        } else {
            return ResponseEntity.badRequest().body("Failed to delete wallet.");
        }
    }

    @GetMapping("/getForAccountHouseHold")
    public ResponseEntity<?> getWalletForAccountHouseHold(@RequestHeader("Authorization") String jwt) {
        try {
            var wallets = walletService.getWalletForAccountHouseHold(jwt);
            return ResponseEntity.ok(wallets);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error retrieving wallets: " + e.getMessage());
        }
    }

    @GetMapping("/get")
    public ResponseEntity<?> getAllWallets() {
        try {
            var wallets = walletService.getAllWallets();
            return ResponseEntity.ok(wallets);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error retrieving all wallets: " + e.getMessage());
        }
    }

    @GetMapping("/get/{idWallet}")
    public ResponseEntity<?> getWalletAccountDetailsByIdWallet(@PathVariable int idWallet) {
        try {
            var walletDetails = walletService.getWalletAccountDetailsByIdWallet(idWallet);
            if (walletDetails.isEmpty()) {
                return ResponseEntity.status(404).body("Wallet not found for ID: " + idWallet);
            }
            return ResponseEntity.ok(walletDetails);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error retrieving wallet details: " + e.getMessage());
        }
    }

    @GetMapping("/checkWallet")
    public ResponseEntity<String> checkWalletCreated(@RequestHeader("Authorization") String jwt) {
        boolean isWalletCreated = walletService.checkWalletCreatedOrNot(jwt);

        if (isWalletCreated) {
            return ResponseEntity.ok("Wallet has already been created.");
        } else {
            return ResponseEntity.ok("Wallet has not been created yet.");
        }
    }

}
