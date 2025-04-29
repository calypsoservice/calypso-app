package devtov.calypsoapp.util;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.digest.DigestUtils;

import org.bitcoinj.core.Base58;
import org.bitcoinj.core.Sha256Hash;
import org.springframework.security.crypto.codec.Hex;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class CryptographUtils {

    public String hexToBase58(String address) {
        address = adjustHex(address);
        byte[] decodedHex = address == null ? new byte[0] : Hex.decode(address);
        String base58 = encode58(decodedHex);
        return base58;
    }


    public String base58SToHex(String address) {
        byte[] decoded = decode58(address);
        String hexString = decoded == null ? "" : org.spongycastle.util.encoders.Hex.toHexString(decoded);
        return hexString;
    }


    private String adjustHex(String hexString) {
        if (hexString.startsWith("0x")) {
            hexString = "41" + hexString.substring(2);
        }
        if (hexString.length() % 2 == 1) {
            hexString = "0" + hexString;
        }
        return hexString;
    }

    private String encode58(byte[] input) {
        byte[] hash0 = DigestUtils.sha256(input);
        byte[] hash1 = DigestUtils.sha256(hash0);
        byte[] inputCheck = new byte[input.length + 4];
        System.arraycopy(input, 0, inputCheck, 0, input.length);
        System.arraycopy(hash1, 0, inputCheck, input.length, 4);
        return Base58.encode(inputCheck);

    }


    private byte[] decode58(String input) {
        byte[] decodeCheck = Base58.decode(input);
        if (decodeCheck.length <= 4) {
            return null;
        }
        byte[] decodeData = new byte[decodeCheck.length - 4];
        System.arraycopy(decodeCheck, 0, decodeData, 0, decodeData.length);
        byte[] hash0 = Sha256Hash.hash(decodeData);
        byte[] hash1 = Sha256Hash.hash(hash0);
        if (hash1[0] == decodeCheck[decodeData.length] &&
                hash1[1] == decodeCheck[decodeData.length + 1] &&
                hash1[2] == decodeCheck[decodeData.length + 2] &&
                hash1[3] == decodeCheck[decodeData.length + 3]) {
            return decodeData;
        }
        return null;
    }
}
