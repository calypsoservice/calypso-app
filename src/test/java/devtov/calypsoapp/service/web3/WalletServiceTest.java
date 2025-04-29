package devtov.calypsoapp.service.web3;

import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
@Slf4j
class WalletServiceTest {


    @Autowired
    private WalletManager walletManager;


    @Test
    void generateMnemonic() throws Exception {
        String s = walletManager.generateMnemonic();
    }

    @Test
    void checkMnemonic() throws Exception {
        String mnemonic = walletManager.generateMnemonic();
        boolean isValid = walletManager.checkValidMnemonic(mnemonic);
        log.info("Mnemonic: {}", mnemonic);
        log.info("Check valid mnemonic: {}", isValid);
    }

    @Test
    void initWallet() {
        String mnemonic = walletManager.initMnemonic();
        log.info("Wallet mnemonic: {}", mnemonic);
    }

    @Test
    void loadWallet() {

    }


}