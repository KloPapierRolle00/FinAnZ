package com.finantz.controller;

import com.finantz.model.Budget;
import com.finantz.model.Category;
import com.finantz.repository.BudgetRepository;
import com.finantz.repository.CategoryRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budgets")
public class BudgetController {
    private final BudgetRepository budgetRepository;
    private final CategoryRepository categoryRepository;

    public BudgetController(BudgetRepository budgetRepository, CategoryRepository categoryRepository) {
        this.budgetRepository = budgetRepository;
        this.categoryRepository = categoryRepository;
    }

    @GetMapping
    public List<Budget> getBudgets() {
        return budgetRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<Budget> createBudget(@RequestBody Budget budget) {
        if (budget.getCategory() != null && budget.getCategory().getId() != null) {
            Category category = categoryRepository.findById(budget.getCategory().getId()).orElse(null);
            budget.setCategory(category);
        }
        Budget saved = budgetRepository.save(budget);
        return ResponseEntity.ok(saved);
    }
}
