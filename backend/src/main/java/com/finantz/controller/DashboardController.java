package com.finantz.controller;

import com.finantz.model.Budget;
import com.finantz.model.FinancialTransaction;
import com.finantz.repository.BudgetRepository;
import com.finantz.repository.TransactionRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
    private final TransactionRepository transactionRepository;
    private final BudgetRepository budgetRepository;

    public DashboardController(TransactionRepository transactionRepository, BudgetRepository budgetRepository) {
        this.transactionRepository = transactionRepository;
        this.budgetRepository = budgetRepository;
    }

    @GetMapping
    public Map<String, Object> getDashboard() {
        YearMonth currentMonth = YearMonth.now();
        LocalDate start = currentMonth.atDay(1);
        LocalDate end = currentMonth.atEndOfMonth();

        List<FinancialTransaction> monthTransactions = transactionRepository.findAllByDateBetween(start, end);

        double totalIncome = monthTransactions.stream()
                .filter(tx -> tx.getAmount() > 0)
                .mapToDouble(FinancialTransaction::getAmount)
                .sum();

        double totalExpense = monthTransactions.stream()
                .filter(tx -> tx.getAmount() < 0)
                .mapToDouble(FinancialTransaction::getAmount)
                .sum();

        double balance = totalIncome + totalExpense;

        List<Budget> budgets = budgetRepository.findAll();
        Map<Long, Double> spentPerCategory = monthTransactions.stream()
                .filter(tx -> tx.getAmount() < 0 && tx.getCategory() != null)
                .collect(Collectors.groupingBy(tx -> tx.getCategory().getId(), Collectors.summingDouble(tx -> -tx.getAmount())));

        List<Map<String, Object>> budgetReports = budgets.stream().map(budget -> {
            double spent = spentPerCategory.getOrDefault(budget.getCategory().getId(), 0.0);
            double remaining = budget.getMonthlyLimit() - spent;
            String status = remaining >= 0 ? (remaining <= budget.getMonthlyLimit() * 0.1 ? "WARN" : "OK") : "OVER";
            Map<String, Object> item = new HashMap<>();
            item.put("id", budget.getId());
            item.put("category", budget.getCategory().getName());
            item.put("limit", budget.getMonthlyLimit());
            item.put("spent", spent);
            item.put("remaining", remaining);
            item.put("status", status);
            return item;
        }).collect(Collectors.toList());

        Map<String, Object> result = new HashMap<>();
        result.put("totalIncome", totalIncome);
        result.put("totalExpense", totalExpense);
        result.put("balance", balance);
        result.put("budgets", budgetReports);
        return result;
    }
}
