package com.fintech.controller;

import com.fintech.dto.TransactionDto;
import com.fintech.entity.Transaction;
import com.fintech.entity.User;
import com.fintech.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "*")
public class TransactionController {
    
    @Autowired
    private TransactionService transactionService;
    
    @PostMapping("/send")
    public ResponseEntity<?> sendMoney(@AuthenticationPrincipal User user, @Valid @RequestBody TransactionDto transactionDto) {
        try {
            Transaction transaction = transactionService.sendMoney(user, transactionDto);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Money sent successfully");
            response.put("transactionId", transaction.getTransactionId());
            response.put("amount", transaction.getAmount());
            response.put("status", transaction.getStatus());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/history")
    public ResponseEntity<?> getTransactionHistory(@AuthenticationPrincipal User user,
                                                   @RequestParam(defaultValue = "0") int page,
                                                   @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Transaction> transactions = transactionService.getUserTransactions(user, pageable);
            
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
