package devtov.calypsoapp.service.web3;

import devtov.calypsoapp.dto.BlockchainTransactionResult;
import devtov.calypsoapp.entity.User;
import devtov.calypsoapp.entity.WalletAddress;
import devtov.calypsoapp.entity.WalletTransaction;
import devtov.calypsoapp.service.repository.UserService;
import devtov.calypsoapp.service.repository.WalletAddressService;
import devtov.calypsoapp.service.repository.WalletTransactionService;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.tron.trident.core.exceptions.IllegalException;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static java.time.temporal.ChronoUnit.DAYS;
import static java.time.temporal.ChronoUnit.MINUTES;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Slf4j
class TransactionWEB3ManagerTest {

    @Autowired
    private TransactionWEB3Manager web3Manager;
    @Autowired
    private UserService userService;
    @Autowired
    private WalletAddressService walletAddressService;
    @Autowired
    private TransactionWEB3Manager transactionWEB3Manager;
    @Autowired
    private WalletTransactionService walletTransactionService;

    @Test
    void etherTransaction() {
        User user = userService.findByEmail("devdeorlov@gmail.com");
        web3Manager.etherTransaction(null, "0x2b745dcd9a49a91186bfe20e8e3645a77d18d8cf", "0.0001");
    }

    @Test
    void etherBalance() {
        WalletAddress byId = walletAddressService.findById(3);
        web3Manager.etherBalance(byId);
    }

    @Test
    void etherTransactionData() {
        String hash = "0x123b8406b51a2c6e713bc4c19b66b3be07fe75354a9450781a001bb3dd97eca8";
        web3Manager.etherTransactionData(hash);
    }


    @Test
    void tronBalance() {
        WalletAddress walletAddress = walletAddressService.findById(1);
        transactionWEB3Manager.tronBalance(walletAddress);
    }


    @Test
    void tronTransactionData() {

        transactionWEB3Manager.tronTransactionData("ec7ef14dde9f5f50af5f5b2c72f423b2c3e977ccc44a1e98a8ded0927bd28a40");


    }

    @Test
    void tetherTransactionData() throws IllegalException {
        WalletAddress walletAddress = walletAddressService.findById(2);
        web3Manager.tetherTransactionData("0x0000000000000000000000000000000000000000000000000000000000000003", walletAddress);
    }


    @Test
    void getTransactionByHash() {
        WalletAddress byId = walletAddressService.findById(3);
//        transactionWEB3Manager.getEthereumTransactionData(byId, "0xe54e84eca0b419f7579b1adf2ba50e01b1b9d66a2af48ea4e3ac5e25801025ca");
    }

    @Test
    void sendTronTransaction() {
        WalletAddress addressTo = walletAddressService.findById(1);
        WalletAddress addressFrom = walletAddressService.findById(16);

//        transactionWEB3Manager.sendTronTransaction(addressTo, addressFrom, new BigDecimal("0.01"));
    }

    @Test
    void tetherTransaction() {
        WalletAddress addressTo = walletAddressService.findById(2);
        WalletAddress addressFrom = walletAddressService.findById(17);
        transactionWEB3Manager.tetherTransaction(addressTo, addressFrom, new BigDecimal("1"));
    }


    @Test
    void getTransactionData() {
        WalletTransaction byId = walletTransactionService.findById(39);
        BlockchainTransactionResult transactionData = transactionWEB3Manager.getTransactionData(byId);
        log.info("transactionData: {}", transactionData);
    }

    @Test
    void tronTransactionDat222a() {
        LocalDateTime parse = LocalDateTime.parse("2024-11-15T19:29");
        log.info("parse: {}", parse);


    }


    @Test
    void bitcoinBalance() {
        WalletAddress walletAddress = walletAddressService.findById(126);
//        bc1qx4l0z2wepepa3dd9vuukcvqqc30q5m0r9x5rke

        transactionWEB3Manager.bitcoinBalance(walletAddress);

    }


//    TODO TEST TON

    @Test
    void tonBalance() {
        WalletAddress walletAddress = walletAddressService.findById(95);
        transactionWEB3Manager.tonBalance(walletAddress);
    }

}