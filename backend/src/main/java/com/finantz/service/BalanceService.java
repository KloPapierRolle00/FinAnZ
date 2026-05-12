package com.finantz.service;

import com.finantz.model.Account;
import com.finantz.model.FinancialTransaction;
import com.finantz.model.TransactionType;
import com.finantz.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BalanceService {
    private final TransactionRepository transactionRepository;

    public BalanceService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    public double calculateCurrentBalance(Account account) {
        double balance = account.getInitialBalance();
        
        List<FinancialTransaction> transactions = transactionRepository.findAll();
        for (FinancialTransaction tx : transactions) {
            if (tx.getAccount() != null && tx.getAccount().getId().equals(account.getId())) {
                if (TransactionType.INCOME.equals(tx.getType())) {
                    balance += tx.getAmount();
                } else {
                    balance -= tx.getAmount();
                }
            }
        }
        
        return balance;
    }
}
