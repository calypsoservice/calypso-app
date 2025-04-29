package devtov.calypsoapp.util;

import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.stereotype.Component;

@Component
public class RandomizerUtils {

    private final int length = 4;
    private final boolean useLetters = false;
    private final boolean useNumbers = true;


    public String generateEmailCode() {
        return RandomStringUtils.random(length, useLetters, useNumbers);
    }

    public String generateReferralCode() {
        return RandomStringUtils.random(20, true, true);
    }

    public String generateTransactionHash() {
        return "0x" + RandomStringUtils.random(64, true, true);
    }




}
