package devtov.calypsoapp.service.api;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import devtov.calypsoapp.dto.TokenApiModel;
import devtov.calypsoapp.entity.Token;
import devtov.calypsoapp.service.repository.TokenService;
import jakarta.annotation.PostConstruct;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@Slf4j
@AllArgsConstructor
public class TokenApiService {

    private final RestTemplate restTemplate;
    private final TokenService tokenService;
    private final ObjectMapper objectMapper;
    private final String URL = "https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?symbol=_list_of_coin_&convert=USD";

    @PostConstruct
    public void updateCoinPrice() {


//        try {
//            TimeUnit.MINUTES.sleep(1);
//        } catch (Exception e) {
//            log.warn("Exception before token info update.", e);
//        }


        new Thread(() -> {
            while (true) {

                try {
                    log.info("Start update COINS");
                    List<TokenApiModel> allTokenData = getAllCoinData();
                    updateCoinPriceAndChange(allTokenData);
                } catch (Exception e) {
                    log.warn("Bad get coin data.", e);
                }

                try {
                    TimeUnit.SECONDS.sleep(30);
                } catch (InterruptedException e) {

                }
            }
        }).start();

    }

    public void updateCoinPriceAndChange(List<TokenApiModel> tokenInfoApiModelList) {
        try {

            tokenInfoApiModelList
                    .forEach(cw -> {
                        try {
                            String symbol = cw.getSymbol();

                            log.info("Find by SYMBOL: {}", symbol);
                            List<Token> tokenInfoList = tokenService.findBySymbol(symbol);
                            tokenInfoList
                                    .forEach(ti -> {
                                        if (Objects.nonNull(ti)) {
                                            BigDecimal price = new BigDecimal(cw.getTokenDataApiModel().getTokenUDSTApiModel().getPrice().toPlainString()).setScale(ti.getDecimalLength(), RoundingMode.HALF_DOWN);
                                            double tokenPrice = Double.parseDouble(price.toString());
                                            ti.setPrice(tokenPrice);
                                            String percentChange24h = cw.getTokenDataApiModel().getTokenUDSTApiModel().getPercentChange24h();
                                            String format = String.format("%.2f", Float.valueOf(percentChange24h));
                                            ti.setPercentChange(format);
                                            tokenService.update(ti);
                                        }
                                    });

                        } catch (Exception ex) {
                            log.warn("Exception.", ex);
                        }
                    });

        } catch (Exception e) {
            log.warn("Update coin.", e);
        }


    }


    public List<TokenApiModel> getAllCoinData() {
        try {

            List<Token> coins = tokenService.findAll();
            String coinNames = coins
                    .stream()
                    .map(Token::getSymbol)
                    .collect(Collectors.joining(","));


            HttpHeaders headers = new HttpHeaders();
            headers.add("Accept", "application/json");
            headers.add("X-CMC_PRO_API_KEY", "f629a1c1-8bff-4649-86c5-6b224a9bd070");

            HttpEntity entity = new HttpEntity(headers);
            String newURL = URL.replace("_list_of_coin_", coinNames);
            log.info("New URL: {}", newURL);

            ResponseEntity<String> exchange = restTemplate.exchange(newURL, HttpMethod.GET, entity, String.class);
            log.info("Exchange JSON response: {}", exchange.getBody());
            JsonNode jsonNode = objectMapper.readTree(exchange.getBody());
            Iterator<JsonNode> data = jsonNode.findValue("data").elements();
            List<TokenApiModel> responseCoinWrapperList = new ArrayList<>();
            while (data.hasNext()) {
                try {

                    JsonNode next = data.next();
                    TokenApiModel[] responseCoinWrappers = objectMapper.treeToValue(next, TokenApiModel[].class);
                    TokenApiModel responseCoinWrapper = Arrays.stream(responseCoinWrappers)
                            .findFirst().orElse(null);

                    if (Objects.nonNull(responseCoinWrapper)) {
                        log.info("c: {}", responseCoinWrapper);
                        responseCoinWrapperList.add(responseCoinWrapper);
                    }
                } catch (Exception ex) {
                    log.warn("Exception.", ex);
                }
            }

            return responseCoinWrapperList;
        } catch (Exception ex) {
            log.warn("Exception.", ex);
            return new ArrayList<>();
        }
    }

}
