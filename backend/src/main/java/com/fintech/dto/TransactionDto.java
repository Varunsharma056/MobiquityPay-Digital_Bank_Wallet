package com.fintech.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class TransactionDto {
    
    @NotBlank(message = "Receiver identifier is required")
    private String receiverIdentifier; // email or phone
    
    @NotNull(message = "Amount is required")
    @DecimalMin(value = "1.0", message = "Amount must be at least 1")
    private BigDecimal amount;
    
    private String description;
    
    private String pin; // Transaction PIN for security
}
