package devtov.calypsoapp.service.web3;

import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;


@SpringBootTest
@Slf4j
class TronManagerTest {

    @Autowired
    private TronManager tronManager;

    @Test
    void sendTransaction() {
        tronManager.sendTransaction();
    }
}