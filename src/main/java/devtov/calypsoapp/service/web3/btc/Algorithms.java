package devtov.calypsoapp.service.web3.btc;


import org.bitcoinj.crypto.DeterministicKey;

public class Algorithms {

    public static String getAddress(String phrase) {

        Mnemonic mnemonic = new Mnemonic(phrase);
        Key masterKey = mnemonic.getMasterKeys();
        Key derivatedKey = masterKey.derivateFirstKey(AddressFormat.BIP84);
        String publicKey = derivatedKey.getPublicKey();


        return generateAddress(publicKey, AddressFormat.BIP84);

    }

    public static DeterministicKey generateMasterKeys (String seed) {
        byte[] seedByte = ConvertBase.binaryToBytes(ConvertBase.hexToBinary(seed));
        DeterministicKey keys = HDKeyDerivation.createMasterPrivateKey(seedByte);
        return keys;
    }


    public static String generateAddress(String publicKey, AddressFormat format) {


        if (format == AddressFormat.BIP44) {
            return GenerateAddress.generateBip44(publicKey);
        }
        if (format == AddressFormat.BIP49) {
            return GenerateAddress.generateBip49(publicKey);
        }
        if (format == AddressFormat.BIP84) {
            return GenerateAddress.generateBip84(publicKey);
        }

        return null;




    }
}
