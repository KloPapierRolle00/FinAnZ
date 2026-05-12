package com.finantz.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
public class RecurringTransaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String description;
    private double amount;

    @Enumerated(EnumType.STRING)
    private TransactionType type;

    // Day of month (1-31) when this transaction occurs
    private int dayOfMonth;

    // Last execution date to track if we need to process it
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate lastExecuted;

    private boolean active = true;

    @ManyToOne
    private Account account;

    @ManyToOne
    private Category category;

    public RecurringTransaction() {
    }

    public RecurringTransaction(String description, double amount, TransactionType type, int dayOfMonth, Account account, Category category) {
        this.description = description;
        this.amount = amount;
        this.type = type;
        this.dayOfMonth = dayOfMonth;
        this.account = account;
        this.category = category;
    }

    public Long getId() {
        return id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public TransactionType getType() {
        return type;
    }

    public void setType(TransactionType type) {
        this.type = type;
    }

    public int getDayOfMonth() {
        return dayOfMonth;
    }

    public void setDayOfMonth(int dayOfMonth) {
        this.dayOfMonth = dayOfMonth;
    }

    public LocalDate getLastExecuted() {
        return lastExecuted;
    }

    public void setLastExecuted(LocalDate lastExecuted) {
        this.lastExecuted = lastExecuted;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public Account getAccount() {
        return account;
    }

    public void setAccount(Account account) {
        this.account = account;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }
}
