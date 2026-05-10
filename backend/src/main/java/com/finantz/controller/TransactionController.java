package com.finantz.controller;

import com.finantz.model.Account;
import com.finantz.model.Category;
import com.finantz.model.FinancialTransaction;
import com.finantz.model.TransactionType;
import com.finantz.repository.AccountRepository;
import com.finantz.repository.CategoryRepository;
import com.finantz.repository.TransactionRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {
    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;
    private final CategoryRepository categoryRepository;

    public TransactionController(TransactionRepository transactionRepository,
                                 AccountRepository accountRepository,
                                 CategoryRepository categoryRepository) {
        this.transactionRepository = transactionRepository;
        this.accountRepository = accountRepository;
        this.categoryRepository = categoryRepository;
    }

    @GetMapping
    public List<FinancialTransaction> getTransactions() {
        return transactionRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<FinancialTransaction> createTransaction(@RequestBody FinancialTransaction transaction) {
        if (transaction.getDate() == null) {
            transaction.setDate(LocalDate.now());
        }
        if (transaction.getType() == null) {
            transaction.setType(TransactionType.EXPENSE);
        }

        if (transaction.getAccount() != null && transaction.getAccount().getId() != null) {
            Account account = accountRepository.findById(transaction.getAccount().getId()).orElse(null);
            transaction.setAccount(account);
        }

        if (transaction.getCategory() != null && transaction.getCategory().getId() != null) {
            Category category = categoryRepository.findById(transaction.getCategory().getId()).orElse(null);
            transaction.setCategory(category);
        }

        FinancialTransaction saved = transactionRepository.save(transaction);
        return ResponseEntity.ok(saved);
    }
}
