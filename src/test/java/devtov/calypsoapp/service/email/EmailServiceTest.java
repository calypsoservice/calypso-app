package devtov.calypsoapp.service.email;

import devtov.calypsoapp.enums.EmailType;
import devtov.calypsoapp.util.EmailUtils;
import devtov.calypsoapp.util.RandomizerUtils;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Slf4j
class EmailServiceTest {

    @Autowired
    EmailService emailService;
    @Autowired
    EmailUtils emailUtils;
    @Autowired
    RandomizerUtils randomizerUtils;

    @Test
    void sendSimpleEmail() {
        log.info("Start send message");
        emailService.sendSimpleEmail("devdeorlov@gmail.com", randomizerUtils.generateEmailCode(),EmailType.AUTH);
        log.info("End send message");
    }
}