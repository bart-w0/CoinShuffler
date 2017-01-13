package com.bartw.coinshuffler.domain;

public class CoinDto {

  private String name;
  private double balance;

  public CoinDto() {

  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public double getBalance() {
    return balance;
  }

  public void setBalance(double balance) {
    this.balance = balance;
  }
}
