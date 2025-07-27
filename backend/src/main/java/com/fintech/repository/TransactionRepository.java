package com.fintech.repository;

import com.fintech.entity.Transaction;
import com.fintech.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    Page<Transaction> findBySenderOrReceiverOrderByCreatedAtDesc(User sender, User receiver, Pageable pageable);
    Page<Transaction> findBySenderOrderByCreatedAtDesc(User sender, Pageable pageable);
    Page<Transaction> findByReceiverOrderByCreatedAtDesc(User receiver, Pageable pageable);
}
