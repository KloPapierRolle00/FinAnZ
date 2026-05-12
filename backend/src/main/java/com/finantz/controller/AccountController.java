package com.finantz.controller;

import com.finantz.model.Account;
import com.finantz.repository.AccountRepository;
import com.finantz.service.BalanceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {
    private final AccountRepository accountRepository;
    private final BalanceService balanceService;

    public AccountController(AccountRepository accountRepository, BalanceService balanceService) {
        this.accountRepository = accountRepository;
        this.balanceService = balanceService;
    }

    @GetMapping
    public List<Account> getAccounts() {
        List<Account> accounts = accountRepository.findAll();
        // Berechne aktuelle Balance für jedes Konto
        for (Account account : accounts) {
            account.setCurrentBalance(balanceService.calculateCurrentBalance(account));
        }
        return accounts;
    }

    @PostMapping
    public ResponseEntity<Account> createAccount(@RequestBody Account account) {
        Account saved = accountRepository.save(account);
        saved.setCurrentBalance(balanceService.calculateCurrentBalance(saved));
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Account> updateAccount(@PathVariable Long id, @RequestBody Account update) {
        return accountRepository.findById(id)
                .map(existing -> {
                    if (update.getName() != null) {
                        existing.setName(update.getName());
                    }
                    if (update.getInitialBalance() > 0) {
                        existing.setInitialBalance(update.getInitialBalance());
                    }
                    existing = accountRepository.save(existing);
                    existing.setCurrentBalance(balanceService.calculateCurrentBalance(existing));
                    return ResponseEntity.ok(existing);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
