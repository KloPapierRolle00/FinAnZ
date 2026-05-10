package com.finantz;

import com.finantz.model.Account;
import com.finantz.model.Budget;
import com.finantz.model.Category;
import com.finantz.model.FinancialTransaction;
import com.finantz.model.TransactionType;
import com.finantz.model.User;
import com.finantz.repository.AccountRepository;
import com.finantz.repository.BudgetRepository;
import com.finantz.repository.CategoryRepository;
import com.finantz.repository.TransactionRepository;
import com.finantz.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;

@Configuration
public class DataInitializer {
    @Bean
    public CommandLineRunner initData(AccountRepository accountRepository,
                                      CategoryRepository categoryRepository,
                                      TransactionRepository transactionRepository,
                                      BudgetRepository budgetRepository,
                                      UserRepository userRepository,
                                      PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.count() == 0) {
                userRepository.save(new User("admin", passwordEncoder.encode("admin")));
            }

            if (accountRepository.count() == 0) {
                Account girokonto = accountRepository.save(new Account("Girokonto", 4200.00));
                Account cash = accountRepository.save(new Account("Bargeld", 150.00));

                Category salary = categoryRepository.save(new Category("Gehalt"));
                Category groceries = categoryRepository.save(new Category("Lebensmittel"));
                Category rent = categoryRepository.save(new Category("Miete"));

                transactionRepository.save(new FinancialTransaction("Gehalt April", 3200.00, TransactionType.INCOME, LocalDate.now().minusDays(2), girokonto, salary));
                transactionRepository.save(new FinancialTransaction("Supermarkt", -75.40, TransactionType.EXPENSE, LocalDate.now().minusDays(1), cash, groceries));
                transactionRepository.save(new FinancialTransaction("Miete", -950.00, TransactionType.EXPENSE, LocalDate.now().minusDays(5), girokonto, rent));

                budgetRepository.save(new Budget(groceries, 400.00));
                budgetRepository.save(new Budget(rent, 1000.00));
            }
        };
    }
}
