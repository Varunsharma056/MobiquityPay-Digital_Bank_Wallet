package com.fintech;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication
@EnableTransactionManagement
public class FinTechApplication {
    public static void main(String[] args) {
        SpringApplication.run(FinTechApplication.class, args);
    }
}
