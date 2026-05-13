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

    @GetMapping("/search")
    public List<FinancialTransaction> searchTransactions(
            @RequestParam(required = false) Long accountId,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String from,
            @RequestParam(required = false) String to,
            @RequestParam(required = false) Double minAmount,
            @RequestParam(required = false) Double maxAmount) {

        return transactionRepository.findAll().stream()
                .filter(tx -> {
                    if (accountId != null && (tx.getAccount() == null || !accountId.equals(tx.getAccount().getId()))) {
                        return false;
                    }
                    if (categoryId != null && (tx.getCategory() == null || !categoryId.equals(tx.getCategory().getId()))) {
                        return false;
                    }
                    if (q != null && !q.isBlank() && !tx.getDescription().toLowerCase().contains(q.toLowerCase())) {
                        return false;
                    }
                    if (from != null && !from.isBlank()) {
                        LocalDate fromDate = LocalDate.parse(from);
                        if (tx.getDate().isBefore(fromDate)) {
                            return false;
                        }
                    }
                    if (to != null && !to.isBlank()) {
                        LocalDate toDate = LocalDate.parse(to);
                        if (tx.getDate().isAfter(toDate)) {
                            return false;
                        }
                    }
                    if (minAmount != null && tx.getAmount() < minAmount) {
                        return false;
                    }
                    if (maxAmount != null && tx.getAmount() > maxAmount) {
                        return false;
                    }
                    return true;
                })
                .toList();
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

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransaction(@PathVariable Long id) {
        if (transactionRepository.existsById(id)) {
            transactionRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/transfer")
    public ResponseEntity<?> transferMoney(@RequestParam Long fromAccountId, @RequestParam Long toAccountId, @RequestParam double amount) {
        Account fromAccount = accountRepository.findById(fromAccountId).orElse(null);
        Account toAccount = accountRepository.findById(toAccountId).orElse(null);

        if (fromAccount == null || toAccount == null) {
            return ResponseEntity.badRequest().body("Konten nicht gefunden");
        }

        // Create withdrawal from source account
        FinancialTransaction withdrawal = new FinancialTransaction();
        withdrawal.setDescription("Transfer zu " + toAccount.getName());
        withdrawal.setAmount(amount);
        withdrawal.setType(TransactionType.EXPENSE);
        withdrawal.setDate(LocalDate.now());
        withdrawal.setAccount(fromAccount);
        transactionRepository.save(withdrawal);

        // Create deposit to target account
        FinancialTransaction deposit = new FinancialTransaction();
        deposit.setDescription("Transfer von " + fromAccount.getName());
        deposit.setAmount(amount);
        deposit.setType(TransactionType.INCOME);
        deposit.setDate(LocalDate.now());
        deposit.setAccount(toAccount);
        transactionRepository.save(deposit);

        return ResponseEntity.ok().body("Transfer erfolgreich");
    }
}
