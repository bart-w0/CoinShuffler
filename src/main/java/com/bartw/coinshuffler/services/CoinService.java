package com.bartw.coinshuffler.services;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bartw.coinshuffler.domain.CoinDto;

@Service
public class CoinService {

  @Autowired
  private Connection connection;

  public List<CoinDto> loadCoins() throws SQLException {
    List<CoinDto> coin = new ArrayList<>();
    PreparedStatement ps = connection.prepareStatement("SELECT * FROM \"Coins\"");
    ResultSet rs = ps.executeQuery();
    while (rs.next()) {
      CoinDto balanceDto = new CoinDto();
      String name = rs.getString("name");
      double balance = rs.getDouble("balance");
      balanceDto.setName(name);
      balanceDto.setBalance(balance);
      coin.add(balanceDto);
    }
    return coin;
  }

  public void createCoin(CoinDto coin) throws SQLException {
    PreparedStatement ps =
        connection.prepareStatement("INSERT INTO \"Coins\" (name, balance) VALUES (?, ?)");
    ps.setString(1, coin.getName());
    ps.setDouble(2, coin.getBalance());
    ps.executeUpdate();
  }

  public void deleteCoin(String name) throws SQLException {
    PreparedStatement ps = connection.prepareStatement("DELETE FROM \"Coins\" WHERE name = ?");
    ps.setString(1, name);
    ps.execute();
  }

  public void updateCoin(String name, CoinDto coin) throws SQLException {
    PreparedStatement ps =
        connection.prepareStatement("UPDATE \"Coins\" SET balance = ? WHERE name = ?");
    ps.setDouble(1, coin.getBalance());
    ps.setString(2, name);
    ps.execute();
  }
}
