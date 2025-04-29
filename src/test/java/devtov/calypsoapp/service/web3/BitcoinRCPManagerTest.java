package devtov.calypsoapp.service.web3;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;


@SpringBootTest
@Slf4j
//@AllArgsConstructor
class BitcoinRCPManagerTest {

    @Autowired
    BitcoinRCPManager bitcoinRCPManager;

    @Test
    void getWalletData() {
        bitcoinRCPManager.getWalletData(null, "6338c7c77149ff1467b7441b497492875a54bc662f4392a4698be3a654e4f712");
    }
}