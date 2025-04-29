package devtov.calypsoapp.service.web3;

import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.io.IOException;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Slf4j
class TronHTTPApiManagerTest {


    @Autowired
    private TronHTTPApiManager tronHTTPApiManager;

    @Test
    void getBalance() throws IOException, InterruptedException {
        tronHTTPApiManager.checkValidAddress();
    }
}