package devtov.calypsoapp.service.web3;

import devtov.calypsoapp.entity.Token;
import devtov.calypsoapp.entity.WalletAddress;
import devtov.calypsoapp.service.repository.TokenService;
import devtov.calypsoapp.service.repository.WalletAddressService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigInteger;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Slf4j
class BlockChainManagerTest {

    @Autowired
    private BlockChainManager blockChainManager;
    @Autowired
    private TokenService tokenService;
    @Autowired
    private WalletAddressService walletAddressService;



    @Test
    void checkBalance() {

    }

    @Test
    void sendTransaction() {

    }
}