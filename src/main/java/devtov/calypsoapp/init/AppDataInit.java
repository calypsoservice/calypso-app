package devtov.calypsoapp.init;

import devtov.calypsoapp.entity.*;
import devtov.calypsoapp.service.repository.*;
import jakarta.annotation.PostConstruct;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Objects;

@Component
@AllArgsConstructor
@Slf4j
public class AppDataInit {

    private final NetworkService networkService;
    private final TokenService tokenService;
    private final StakeService stakeService;
    private final WalletTransactionTypeService walletTransactionTypeService;
    private final WalletTransactionStatusService walletTransactionStatusService;


    @PostConstruct
    public void initData() {
        initNetwork();
        initToken();
        initStake();
        initTransactionTypeAndStatus();

    }

    private void initNetwork() {
        Network tron = networkService.findByName("TRON");
        if (Objects.isNull(tron)) {
            tron = new Network();
            tron.setName("TRON");
            tron.setSymbol("TRX");
            tron.setImage("https://s2.coinmarketcap.com/static/img/coins/64x64/1958.png");
            tron.setChainId(0);
            tron.setNode("https://go.getblock.io/80b9a25388364ecca2abac12674e57e9");
            tron.setTestNode("https://go.getblock.io/022b61112ba64efda1da5929a9522bc6");
            networkService.save(tron);
        }

        Network ethereum = networkService.findByName("Ethereum");
        if (Objects.isNull(ethereum)) {
            ethereum = new Network();
            ethereum.setName("Ethereum");
            ethereum.setSymbol("ETH");
            ethereum.setImage("https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png");
            ethereum.setChainId(0);
            ethereum.setNode("https://go.getblock.io/3072b090e6fa4dafa4a7afeccdca3c89");
            ethereum.setTestNode("https://go.getblock.io/cefc6668c89c41fdb836fb9ce8dd2489");
            networkService.save(ethereum);
        }
    }


    public void initToken() {

        Token tron = tokenService.findByName("Tron");
        if (Objects.isNull(tron)) {
            tron = new Token();
            tron.setName("Tron");
            tron.setSymbol("TRX");
            tron.setNative(true);
            tron.setNetwork(networkService.findByName("TRON"));
            tron.setImage("https://s2.coinmarketcap.com/static/img/coins/64x64/1958.png");
            tron.setDecimalLength(8);
            tron.setSmartContract("");
            tokenService.save(tron);
        }

        Token usdt = tokenService.findByName("Tether");
        if (Objects.isNull(usdt)) {
            usdt = new Token();
            usdt.setName("Tether");
            usdt.setSymbol("USDT");
            usdt.setNative(false);
            usdt.setNetwork(networkService.findByName("TRON"));
            usdt.setImage("https://s2.coinmarketcap.com/static/img/coins/64x64/825.png");
            usdt.setDecimalLength(8);
            usdt.setSmartContract("TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t");
            tokenService.save(usdt);
        }


        Token ethereum = tokenService.findByName("Ethereum");
        if (Objects.isNull(ethereum)) {
            ethereum = new Token();
            ethereum.setName("Ethereum");
            ethereum.setSymbol("ETH");
            ethereum.setNative(true);
            ethereum.setNetwork(networkService.findByName("Ethereum"));
            ethereum.setImage("https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png");
            ethereum.setDecimalLength(8);
            ethereum.setSmartContract("");
            tokenService.save(ethereum);
        }


    }


    public void initStake() {
        List<Stake> stakes = stakeService.findAll();
        if (stakes.isEmpty()) {


            Stake stakeFirst = new Stake();
            stakeFirst.setPeriodDays(15);
            stakeFirst.setPercentDay(0.65);
            stakeFirst.setMinAmount(50);
            stakeFirst.setMaxAmount(500);
            stakeFirst.setName("Rapide 1");
            stakeService.save(stakeFirst);


            Stake stakeSecond = new Stake();
            stakeSecond.setPeriodDays(25);
            stakeSecond.setPercentDay(0.85);
            stakeSecond.setMinAmount(500);
            stakeSecond.setMaxAmount(5000);
            stakeSecond.setName("Rapide 2");
            stakeService.save(stakeSecond);


            Stake stakeThird = new Stake();
            stakeThird.setPeriodDays(40);
            stakeThird.setPercentDay(1);
            stakeThird.setMinAmount(5000);
            stakeThird.setMaxAmount(15000);
            stakeThird.setName("Rapide 3");
            stakeService.save(stakeThird);


            Stake stakeFourth = new Stake();
            stakeFourth.setPeriodDays(65);
            stakeFourth.setPercentDay(1.15);
            stakeFourth.setMinAmount(15000);
            stakeFourth.setMaxAmount(30000);
            stakeFourth.setName("Rapide 4");
            stakeService.save(stakeFourth);


            Stake stakeFifth = new Stake();
            stakeFifth.setPeriodDays(90);
            stakeFifth.setPercentDay(1.3);
            stakeFifth.setMinAmount(30000);
            stakeFifth.setMaxAmount(50000);
            stakeFifth.setName("Rapide 5");
            stakeService.save(stakeFifth);


            Stake stakeSixth = new Stake();
            stakeSixth.setPeriodDays(180);
            stakeSixth.setPercentDay(1.45);
            stakeSixth.setMinAmount(50);
            stakeSixth.setMaxAmount(20000);
            stakeSixth.setName("Largo 1");
            stakeService.save(stakeSixth);


            Stake stakeSeventh = new Stake();
            stakeSeventh.setPeriodDays(360);
            stakeSeventh.setPercentDay(1.58);
            stakeSeventh.setMinAmount(20000);
            stakeSeventh.setMaxAmount(50000);
            stakeSeventh.setName("Largo 2");
            stakeService.save(stakeSeventh);

        }

    }


    public void initTransactionTypeAndStatus() {


        WalletTransactionType stake = walletTransactionTypeService.findByType("stake");
        if (Objects.isNull(stake)) {
            WalletTransactionType type = new WalletTransactionType();
            type.setType("stake");
            walletTransactionTypeService.save(type);
        }

        WalletTransactionType unstake = walletTransactionTypeService.findByType("unstake");
        if (Objects.isNull(unstake)) {
            WalletTransactionType type = new WalletTransactionType();
            type.setType("unstake");
            walletTransactionTypeService.save(type);
        }

        WalletTransactionType receive = walletTransactionTypeService.findByType("receive");
        if (Objects.isNull(receive)) {
            WalletTransactionType type = new WalletTransactionType();
            type.setType("receive");
            walletTransactionTypeService.save(type);
        }


        WalletTransactionType withdraw = walletTransactionTypeService.findByType("withdraw");
        if (Objects.isNull(withdraw)) {
            WalletTransactionType type = new WalletTransactionType();
            type.setType("withdraw");
            walletTransactionTypeService.save(type);
        }

        WalletTransactionType refBonus = walletTransactionTypeService.findByType("refBonus");
        if (Objects.isNull(refBonus)) {
            WalletTransactionType type = new WalletTransactionType();
            type.setType("refBonus");
            walletTransactionTypeService.save(type);
        }

        WalletTransactionType bonus = walletTransactionTypeService.findByType("bonus");
        if (Objects.isNull(bonus)) {
            WalletTransactionType type = new WalletTransactionType();
            type.setType("bonus");
            walletTransactionTypeService.save(type);
        }


        WalletTransactionStatus prepared = walletTransactionStatusService.findByStatus("prepared");

        if (Objects.isNull(prepared)) {
            WalletTransactionStatus status = new WalletTransactionStatus();
            status.setStatus("prepared");
            walletTransactionStatusService.save(status);
        }

        WalletTransactionStatus confirmation = walletTransactionStatusService.findByStatus("confirmation");
        if (Objects.isNull(confirmation)) {
            WalletTransactionStatus status = new WalletTransactionStatus();
            status.setStatus("confirmation");
            walletTransactionStatusService.save(status);
        }


        WalletTransactionStatus completed = walletTransactionStatusService.findByStatus("completed");
        if (Objects.isNull(completed)) {
            WalletTransactionStatus status = new WalletTransactionStatus();
            status.setStatus("completed");
            walletTransactionStatusService.save(status);
        }

        WalletTransactionStatus error = walletTransactionStatusService.findByStatus("error");
        if (Objects.isNull(completed)) {
            WalletTransactionStatus status = new WalletTransactionStatus();
            status.setStatus("error");
            walletTransactionStatusService.save(status);
        }
        WalletTransactionStatus incorrectAmount = walletTransactionStatusService.findByStatus("incorrect_amount");
        if (Objects.isNull(completed)) {
            WalletTransactionStatus status = new WalletTransactionStatus();
            status.setStatus("incorrect_amount");
            walletTransactionStatusService.save(status);
        }





    }


}



