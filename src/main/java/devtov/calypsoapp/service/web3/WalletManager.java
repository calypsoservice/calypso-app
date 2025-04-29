package devtov.calypsoapp.service.web3;

import devtov.calypsoapp.util.CryptographUtils;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.web3j.crypto.MnemonicUtils;

import java.security.SecureRandom;


@Service
@Slf4j
@AllArgsConstructor
public class WalletManager {

    private final CryptographUtils cryptographUtils;


    public String initMnemonic() {
        return generateMnemonic();
    }


    public String generateMnemonic() {
        SecureRandom secureRandom = new SecureRandom();
        byte[] bytes = secureRandom.generateSeed(16);
        String mnemonic = MnemonicUtils.generateMnemonic(bytes);
        log.info("Generate mnemonic {}", mnemonic);
        boolean isValid = checkValidMnemonic(mnemonic);

        if (isValid)
            return mnemonic;
        else
            return null;
    }

    public boolean checkValidMnemonic(String mnemonic) {
        boolean isValid = MnemonicUtils.validateMnemonic(mnemonic);
        log.info("Check valid mnemonic {}, is valid: {}", mnemonic, isValid);
        return isValid;
    }

}
