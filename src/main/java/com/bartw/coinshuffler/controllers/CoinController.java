package com.bartw.coinshuffler.controllers;

import java.sql.SQLException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.bartw.coinshuffler.domain.CoinDto;
import com.bartw.coinshuffler.services.CoinService;

@RestController
public class CoinController {

  @Autowired
  private CoinService coinsService;

  @RequestMapping(value = "/coins", method = RequestMethod.GET)
  public @ResponseBody List<CoinDto> getCoins() throws SQLException {
    return coinsService.loadCoins();
  }

  @RequestMapping(value = "/coins/{coin}", method = RequestMethod.PUT,
      consumes = MediaType.APPLICATION_JSON_VALUE)
  public void putBalance(@PathVariable("coin") String name, @RequestBody CoinDto coin)
      throws SQLException {
    coinsService.updateCoin(name, coin);
  }

  @RequestMapping(value = "/coins", method = RequestMethod.POST,
      consumes = MediaType.APPLICATION_JSON_VALUE)
  public void postBalance(@RequestBody CoinDto coin) throws SQLException {
    coinsService.createCoin(coin);
  }

  @RequestMapping(value = "/coins/{name}", method = RequestMethod.DELETE)
  public void deleteBalance(@PathVariable("name") String name) throws SQLException {
    coinsService.deleteCoin(name);
  }
}
