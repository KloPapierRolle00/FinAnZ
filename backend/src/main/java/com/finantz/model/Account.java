package com.finantz.model;

import jakarta.persistence.*;

@Entity
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String currency = "EUR";
    private double initialBalance;
    
    @Transient
    private double currentBalance;

    public Account() {
    }

    public Account(String name, double balance) {
        this.name = name;
        this.initialBalance = balance;
        this.currentBalance = balance;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public double getInitialBalance() {
        return initialBalance;
    }

    public void setInitialBalance(double initialBalance) {
        this.initialBalance = initialBalance;
    }

    public double getCurrentBalance() {
        return currentBalance;
    }

    public void setCurrentBalance(double currentBalance) {
        this.currentBalance = currentBalance;
    }

    // Für Kompatibilität mit altem Code
    public double getBalance() {
        return currentBalance;
    }

    public void setBalance(double balance) {
        this.currentBalance = balance;
    }
}
