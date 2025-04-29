package devtov.calypsoapp.service.web3;

import com.google.common.collect.ImmutableList;
import com.iwebpp.crypto.TweetNacl;
import com.iwebpp.crypto.TweetNaclFast;
import devtov.calypsoapp.dto.WalletAddressModel;
import devtov.calypsoapp.dto.api.AddressApiModel;
import devtov.calypsoapp.dto.api.WalletApiModel;
import devtov.calypsoapp.service.api.TrustApiService;
import devtov.calypsoapp.service.web3.btc.SHA;
import devtov.calypsoapp.util.CryptographUtils;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bitcoinj.core.Address;
import org.bitcoinj.core.ECKey;
import org.bitcoinj.crypto.ChildNumber;
import org.bitcoinj.params.MainNetParams;
import org.bitcoinj.script.Script;
import org.bitcoinj.wallet.DeterministicSeed;
import org.bitcoinj.wallet.KeyChain;
import org.bouncycastle.jcajce.provider.asymmetric.rsa.DigestSignatureSpi;
import org.springframework.security.web.access.WebInvocationPrivilegeEvaluator;
import org.springframework.stereotype.Service;
import org.ton.java.address.AddressType;
import org.ton.java.bitstring.RealBitString;
import org.ton.java.cell.TonHashMapE;
import org.ton.java.func.FuncRunner;
import org.ton.java.liteclient.LiteClient;
import org.ton.java.mnemonic.Mnemonic;
import org.ton.java.mnemonic.Pair;
import org.ton.java.smartcontract.faucet.TestnetFaucet;
import org.ton.java.smartcontract.highload.HighloadWallet;
import org.ton.java.smartcontract.highload.HighloadWalletV3;
import org.ton.java.smartcontract.token.ft.JettonWallet;
import org.ton.java.smartcontract.types.WalletV5Config;
import org.ton.java.smartcontract.utils.MsgUtils;
import org.ton.java.smartcontract.wallet.ContractUtils;
import org.ton.java.smartcontract.wallet.v4.WalletV4R2;
import org.ton.java.smartcontract.wallet.v5.WalletV5;
import org.ton.java.tlb.types.Message;
import org.ton.java.tlb.types.MsgAddressIntStd;
import org.ton.java.tonconnect.WalletAccount;
import org.ton.java.tonlib.Tonlib;
import org.ton.java.tonlib.types.*;
import org.ton.java.tonlib.types.globalconfig.TonlibConfig;
import org.ton.java.utils.Utils;
import org.tron.trident.crypto.SECP256K1;
import org.web3j.crypto.Bip32ECKeyPair;
import org.web3j.crypto.Credentials;
import org.web3j.crypto.MnemonicUtils;

import java.math.BigInteger;
import java.util.Arrays;
import java.util.Base64;
import java.util.List;
import java.util.Objects;

import static org.web3j.crypto.Bip32ECKeyPair.HARDENED_BIT;

@Service
@AllArgsConstructor
@Slf4j
public class WalletAddressManager {




    private final CryptographUtils cryptographUtils;
    private final WalletManager walletManager;
    private final WebInvocationPrivilegeEvaluator privilegeEvaluator;
    private final TrustApiService trustApiService;;

    public WalletAddressModel getTronWalletAddress(String mnemonic) {

        Bip32ECKeyPair masterKeypair = Bip32ECKeyPair.generateKeyPair(MnemonicUtils.generateSeed(mnemonic, null));

        int[] path = {44 | HARDENED_BIT, 195 | HARDENED_BIT, 0 | HARDENED_BIT, 0, 0};
        Bip32ECKeyPair x = Bip32ECKeyPair.deriveKeyPair(masterKeypair, path);
        Credentials credentials = Credentials.create(x);

        String privateKey = credentials.getEcKeyPair().getPrivateKey().toString(16);
        String publicKey = credentials.getEcKeyPair().getPublicKey().toString(16);

        WalletAddressModel walletAddressModel = new WalletAddressModel();
        walletAddressModel.setPrivateKey(privateKey);
        walletAddressModel.setPublicKey(publicKey);
        walletAddressModel.setAddress(cryptographUtils.hexToBase58(credentials.getAddress()));

        return walletAddressModel;
    }

    public WalletAddressModel getEthereumWalletAddress(String mnemonic) {

        Bip32ECKeyPair masterKeypair = Bip32ECKeyPair.generateKeyPair(MnemonicUtils.generateSeed(mnemonic, null));
        int[] path = {44 | HARDENED_BIT, 60 | HARDENED_BIT, 0 | HARDENED_BIT, 0, 0};


        Bip32ECKeyPair x = Bip32ECKeyPair.deriveKeyPair(masterKeypair, path);
        Credentials credentials = Credentials.create(x);

        String privateKey = credentials.getEcKeyPair().getPrivateKey().toString(16);
        String publicKey = credentials.getEcKeyPair().getPublicKey().toString(16);

        WalletAddressModel walletAddressModel = new WalletAddressModel();
        walletAddressModel.setPrivateKey(privateKey);
        walletAddressModel.setPublicKey(publicKey);
        walletAddressModel.setAddress(credentials.getAddress());

        return walletAddressModel;
    }


    public WalletAddressModel getBitcoinWalletAddress(String mnemonic) {

        try {

            DeterministicSeed seed = new DeterministicSeed(mnemonic, null, "", 0);
            org.bitcoinj.wallet.Wallet wallet = org.bitcoinj.wallet.Wallet.fromSeed(MainNetParams.get(), seed, Script.ScriptType.P2WPKH, ImmutableList.of(
                    new ChildNumber(84, true),
                    new ChildNumber(0, true),
                    new ChildNumber(0, true)));

            ECKey key = wallet.currentKey(KeyChain.KeyPurpose.RECEIVE_FUNDS);
            log.info("KEY PUBLIC: {}", key.getPublicKeyAsHex());

            String privateKeyWIF = key.getPrivateKeyEncoded(MainNetParams.get()).toBase58();
            log.info("privateKeyWIF: {}", privateKeyWIF);

            Address address = wallet.currentReceiveAddress();
            log.info("address: {}", address);

            WalletAddressModel walletAddressModel = new WalletAddressModel();
            walletAddressModel.setPrivateKey(privateKeyWIF);
            walletAddressModel.setPublicKey(key.getPublicKeyAsHex());
            walletAddressModel.setAddress(address.toString());

            return walletAddressModel;

        } catch (Exception ex) {
            log.warn("Exception while building wallet address", ex);
        }
        return null;
    }


    /**
     * schema:
     * wallet_id -- int32
     * wallet_id = global_id ^ context_id
     * context_id_client$1 = wc:int8 wallet_version:uint8 counter:uint15
     * context_id_backoffice$0 = counter:uint31
     * <p>
     * <p>
     * calculated default values serialisation:
     * <p>
     * global_id = -239, workchain = 0, wallet_version = 0', subwallet_number = 0 (client context)
     * gives wallet_id = 2147483409
     * <p>
     * global_id = -239, workchain = -1, wallet_version = 0', subwallet_number = 0 (client context)
     * gives wallet_id = 8388369
     * <p>
     * global_id = -3, workchain = 0, wallet_version = 0', subwallet_number = 0 (client context)
     * gives wallet_id = 2147483645
     * <p>
     * global_id = -3, workchain = -1, wallet_version = 0', subwallet_number = 0 (client context)
     * gives wallet_id = 8388605
     */


//    TODO
    public WalletAddressModel getTonWalletAddress(String mnemonic) {


        try {
            List<String> list = Arrays.stream(mnemonic.split(" ")).toList();
            Pair keyPair = Mnemonic.toKeyPair(list, "");

            byte[] secretKey = keyPair.getSecretKey();
            byte[] publicKey = keyPair.getPublicKey();

            String secretKeyHex = Utils.bytesToHex(secretKey);
            String publicKeyHex = Utils.bytesToHex(publicKey);
            log.info("secretKeyBase64: {}", secretKeyHex);
            log.info("publicKeyBase64: {}", publicKeyHex);

            TweetNaclFast.Signature.KeyPair keyPairParam = Utils.generateSignatureKeyPairFromSeed(secretKey);


            WalletV5 contract = WalletV5.builder()
                    .wc(0)
                    .walletId(42)
                    .keyPair(keyPairParam)
                    .isSigAuthAllowed(true)
                    .build();


            String addressText = contract.getAddress().toString(true);
            String raw = contract.getAddress().toRaw();
            log.info("raw: {}", raw);
            log.info("addressText: {}", addressText);
            WalletApiModel wallet = trustApiService.getWallet(mnemonic);






//            TODO PROD!!!
            AddressApiModel ton = wallet.getAddresses()
                    .stream()
                    .filter(w -> w.getSymbol().equals("TON"))
                    .findFirst()
                    .orElse(null);
            WalletAddressModel walletAddressModel = new WalletAddressModel();
            walletAddressModel.setPrivateKey(secretKeyHex);
            walletAddressModel.setPublicKey(publicKeyHex);
            if (Objects.nonNull(ton)){
                walletAddressModel.setAddress(ton.getAddress());
            }
            return walletAddressModel;
        } catch (Exception ex) {
            log.warn("Exception while building wallet address", ex);
        }


        return null;
    }

//    public byte[] sum(byte[]... arrays) {
//        // optional: check that arrays.length > 0 (at least one array was passed)
//        final int len = arrays[0].length;
//        final byte[] result = new byte[len];
//        for (byte[] array : arrays) {
//            // optional: test that array has length len
//            for (int i = 0; i < len; ++i) {
//                result[i] += array[i];
//            }
//        }
//        return result;
//    }




}


