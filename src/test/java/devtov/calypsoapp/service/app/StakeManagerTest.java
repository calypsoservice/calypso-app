package devtov.calypsoapp.service.app;

import devtov.calypsoapp.entity.Stake;
import devtov.calypsoapp.entity.UserStake;
import devtov.calypsoapp.service.repository.StakeService;
import devtov.calypsoapp.service.repository.UserStakeService;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;


@SpringBootTest
@Slf4j
class StakeManagerTest {

    @Autowired
    private StakeManager stakeManager;
    @Autowired
    private UserStakeService userStakeService;


    @Test
    void updateStakeData() {
        UserStake byId = userStakeService.findById(1);
        stakeManager.updateStakeData(byId);


    }

    @Test
    void toPercentageOf() {
    }

    @Test
    void percentOf() {
        BigDecimal bigDecimal = stakeManager.percentOf(new BigDecimal("0.16"), new BigDecimal("0.1")).setScale(8, BigDecimal.ROUND_HALF_UP);
        log.info("Result: {}", bigDecimal.toString());
    }
}