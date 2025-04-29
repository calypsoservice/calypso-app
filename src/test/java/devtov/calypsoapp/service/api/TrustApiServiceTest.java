package devtov.calypsoapp.service.api;

import devtov.calypsoapp.dto.api.WalletApiModel;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Slf4j
class TrustApiServiceTest {

    @Autowired
    TrustApiService trustApiService;

    @Test
    void getWallet() {
        WalletApiModel wallet = trustApiService.getWallet("alien crew jar sun hurdle clap powder border slogan only people toy");
        log.warn("Wallet: {}", wallet);
    }
}