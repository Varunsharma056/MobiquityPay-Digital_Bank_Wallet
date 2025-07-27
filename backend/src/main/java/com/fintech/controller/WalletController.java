package com.fintech.controller;

import com.fintech.entity.User;
import com.fintech.entity.Wallet;
import com.fintech.repository.WalletRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/wallet")
@CrossOrigin(origins = "*")
public class WalletController {
    
    @Autowired
    private WalletRepository walletRepository;
    
    @GetMapping("/balance")
    public ResponseEntity<?> getWalletBalance(@AuthenticationPrincipal User user) {
        try {
            Wallet wallet = walletRepository.findByUser(user)
                    .orElseThrow(() -> new RuntimeException("Wallet not found"));
            
            Map<String, Object> response = new HashMap<>();
            response.put("balance", wallet.getBalance());
            response.put("walletNumber", wallet.getWalletNumber());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PostMapping("/add-money")
    public ResponseEntity<?> addMoney(@AuthenticationPrincipal User user, @RequestBody Map<String, Object> request) {
        try {
            BigDecimal amount = new BigDecimal(request.get("amount").toString());
            String referenceNumber = request.get("referenceNumber").toString();
            
            Wallet wallet = walletRepository.findByUser(user)
                    .orElseThrow(() -> new RuntimeException("Wallet not found"));
            
            wallet.setBalance(wallet.getBalance().add(amount));
            walletRepository.save(wallet);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Money added successfully");
            response.put("newBalance", wallet.getBalance());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
