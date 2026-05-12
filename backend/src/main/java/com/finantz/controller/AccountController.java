package com.finantz.controller;

import com.finantz.model.Account;
import com.finantz.repository.AccountRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {
    private final AccountRepository accountRepository;

    public AccountController(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    @GetMapping
    public List<Account> getAccounts() {
        return accountRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<Account> createAccount(@RequestBody Account account) {
        Account saved = accountRepository.save(account);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Account> updateAccount(@PathVariable Long id, @RequestBody Account update) {
        return accountRepository.findById(id)
                .map(existing -> {
                    if (update.getName() != null) {
                        existing.setName(update.getName());
                    }
                    existing.setBalance(update.getBalance());
                    return ResponseEntity.ok(accountRepository.save(existing));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
