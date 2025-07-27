package com.fintech.service;

import com.fintech.dto.TransactionDto;
import com.fintech.entity.Transaction;
import com.fintech.entity.User;
import com.fintech.entity.Wallet;
import com.fintech.enums.TransactionStatus;
import com.fintech.enums.TransactionType;
import com.fintech.repository.TransactionRepository;
import com.fintech.repository.WalletRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@Transactional
public class TransactionService {
    
    @Autowired
    private TransactionRepository transactionRepository;
    
    @Autowired
    private WalletRepository walletRepository;
    
    @Autowired
    private UserService userService;
    
    public Transaction sendMoney(User sender, TransactionDto transactionDto) {
        // Find receiver
        User receiver = userService.findByEmailOrPhone(transactionDto.getReceiverIdentifier());
        
        if (sender.getId().equals(receiver.getId())) {
            throw new RuntimeException("Cannot send money to yourself");
        }
        
        // Get wallets
        Wallet senderWallet = walletRepository.findByUser(sender)
                .orElseThrow(() -> new RuntimeException("Sender wallet not found"));
        
        Wallet receiverWallet = walletRepository.findByUser(receiver)
                .orElseThrow(() -> new RuntimeException("Receiver wallet not found"));
        
        // Check balance
        if (senderWallet.getBalance().compareTo(transactionDto.getAmount()) < 0) {
            throw new RuntimeException("Insufficient balance");
        }
        
        // Create transaction
        Transaction transaction = new Transaction();
        transaction.setTransactionId(generateTransactionId());
        transaction.setSender(sender);
        transaction.setReceiver(receiver);
        transaction.setAmount(transactionDto.getAmount());
        transaction.setType(TransactionType.WALLET_TO_WALLET);
        transaction.setStatus(TransactionStatus.PROCESSING);
        transaction.setDescription(transactionDto.getDescription());
        transaction.setCreatedAt(LocalDateTime.now());
        
        Transaction savedTransaction = transactionRepository.save(transaction);
        
        try {
            // Update balances
            senderWallet.setBalance(senderWallet.getBalance().subtract(transactionDto.getAmount()));
            senderWallet.setUpdatedAt(LocalDateTime.now());
            
            receiverWallet.setBalance(receiverWallet.getBalance().add(transactionDto.getAmount()));
            receiverWallet.setUpdatedAt(LocalDateTime.now());
            
            walletRepository.save(senderWallet);
            walletRepository.save(receiverWallet);
            
            // Update transaction status
            savedTransaction.setStatus(TransactionStatus.COMPLETED);
            savedTransaction.setCompletedAt(LocalDateTime.now());
            
        } catch (Exception e) {
            savedTransaction.setStatus(TransactionStatus.FAILED);
            throw new RuntimeException("Transaction failed: " + e.getMessage());
        }
        
        return transactionRepository.save(savedTransaction);
    }
    
    public Transaction addMoney(User user, BigDecimal amount, String referenceNumber) {
        Wallet wallet = walletRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Wallet not found"));
        
        Transaction transaction = new Transaction();
        transaction.setTransactionId(generateTransactionId());
        transaction.setReceiver(user);
        transaction.setAmount(amount);
        transaction.setType(TransactionType.ADD_MONEY);
        transaction.setStatus(TransactionStatus.COMPLETED);
        transaction.setReferenceNumber(referenceNumber);
        transaction.setCreatedAt(LocalDateTime.now());
        transaction.setCompletedAt(LocalDateTime.now());
        
        // Update wallet balance
        wallet.setBalance(wallet.getBalance().add(amount));
        wallet.setUpdatedAt(LocalDateTime.now());
        walletRepository.save(wallet);
        
        return transactionRepository.save(transaction);
    }
    
    public Page<Transaction> getUserTransactions(User user, Pageable pageable) {
        return transactionRepository.findBySenderOrReceiverOrderByCreatedAtDesc(user, user, pageable);
    }
    
    private String generateTransactionId() {
        return "TXN" + System.currentTimeMillis() + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}
