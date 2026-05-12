package com.finantz.controller;

import com.finantz.model.Account;
import com.finantz.model.Category;
import com.finantz.model.RecurringTransaction;
import com.finantz.repository.AccountRepository;
import com.finantz.repository.CategoryRepository;
import com.finantz.repository.RecurringTransactionRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recurring-transactions")
public class RecurringTransactionController {
    private final RecurringTransactionRepository recurringTransactionRepository;
    private final AccountRepository accountRepository;
    private final CategoryRepository categoryRepository;

    public RecurringTransactionController(RecurringTransactionRepository recurringTransactionRepository,
                                         AccountRepository accountRepository,
                                         CategoryRepository categoryRepository) {
        this.recurringTransactionRepository = recurringTransactionRepository;
        this.accountRepository = accountRepository;
        this.categoryRepository = categoryRepository;
    }

    @GetMapping
    public List<RecurringTransaction> getRecurringTransactions() {
        return recurringTransactionRepository.findAll();
    }

    @GetMapping("/active")
    public List<RecurringTransaction> getActiveRecurringTransactions() {
        return recurringTransactionRepository.findByActiveTrue();
    }

    @PostMapping
    public ResponseEntity<RecurringTransaction> createRecurringTransaction(@RequestBody RecurringTransaction transaction) {
        if (transaction.getType() == null) {
            transaction.setType(com.finantz.model.TransactionType.EXPENSE);
        }

        if (transaction.getAccount() != null && transaction.getAccount().getId() != null) {
            Account account = accountRepository.findById(transaction.getAccount().getId()).orElse(null);
            transaction.setAccount(account);
        }

        if (transaction.getCategory() != null && transaction.getCategory().getId() != null) {
            Category category = categoryRepository.findById(transaction.getCategory().getId()).orElse(null);
            transaction.setCategory(category);
        }

        RecurringTransaction saved = recurringTransactionRepository.save(transaction);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RecurringTransaction> updateRecurringTransaction(@PathVariable Long id, @RequestBody RecurringTransaction transaction) {
        return recurringTransactionRepository.findById(id).map(existing -> {
            existing.setDescription(transaction.getDescription());
            existing.setAmount(transaction.getAmount());
            existing.setType(transaction.getType());
            existing.setDayOfMonth(transaction.getDayOfMonth());
            existing.setActive(transaction.isActive());

            if (transaction.getAccount() != null && transaction.getAccount().getId() != null) {
                Account account = accountRepository.findById(transaction.getAccount().getId()).orElse(null);
                existing.setAccount(account);
            }

            if (transaction.getCategory() != null && transaction.getCategory().getId() != null) {
                Category category = categoryRepository.findById(transaction.getCategory().getId()).orElse(null);
                existing.setCategory(category);
            }

            RecurringTransaction updated = recurringTransactionRepository.save(existing);
            return ResponseEntity.ok(updated);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecurringTransaction(@PathVariable Long id) {
        if (recurringTransactionRepository.existsById(id)) {
            recurringTransactionRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
