package devtov.calypsoapp.service.web3;

import com.iwebpp.crypto.TweetNaclFast;
import devtov.calypsoapp.dto.WalletAddressModel;
import devtov.calypsoapp.entity.Token;
import devtov.calypsoapp.entity.User;
import devtov.calypsoapp.entity.UserWallet;
import devtov.calypsoapp.entity.WalletAddress;
import devtov.calypsoapp.service.repository.TokenService;
import devtov.calypsoapp.service.repository.UserService;
import devtov.calypsoapp.service.repository.UserWalletService;
import devtov.calypsoapp.service.repository.WalletAddressService;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.ton.java.address.Address;
import org.ton.java.liteclient.LiteClient;
import org.ton.java.smartcontract.faucet.TestnetFaucet;
import org.ton.java.smartcontract.types.Destination;
import org.ton.java.smartcontract.types.WalletV5Config;
import org.ton.java.smartcontract.wallet.v5.WalletV5;
import org.ton.java.tlb.types.Message;
import org.ton.java.tonlib.Tonlib;
import org.ton.java.tonlib.types.ExtMessageInfo;
import org.ton.java.tonlib.types.VerbosityLevel;
import org.ton.java.utils.Utils;

import java.math.BigInteger;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;


@SpringBootTest
@Slf4j
class WalletAddressManagerTest {

    @Autowired
    private WalletAddressManager walletAddressManager;
    @Autowired
    private UserService userService;
    @Autowired
    private TokenService tokenService;
    @Autowired
    private WalletAddressService walletAddressService;

    @Test
    void getTronWalletAddress() {
    }

    @Test
    void getEthereumWalletAddress() {
    }

    @Test
    void getBitcoinWalletAddress() {
        User byId = userService.findById(6);
        String mnemonic = byId.getUserWallet().getMnemonic();
        WalletAddressModel bitcoinWalletAddress = walletAddressManager.getBitcoinWalletAddress(mnemonic);


    }


    @Test
    void getTonWalletAddress() {
        User byId = userService.findById(1);
        String mnemonic = byId.getUserWallet().getMnemonic();
//        String mnemonic = "hurdle swim drill nature glance punch bean stove kid anchor order jacket daughter memory fiber rely genuine ice rice diary rather match tattoo cigar";
        walletAddressManager.getTonWalletAddress(mnemonic);
    }


    @Test
    void bitcoinBalance(){

        User user = userService.findById(6);
        UserWallet userWallet = user.getUserWallet();
        WalletAddressModel bitcoinWalletAddress = walletAddressManager.getBitcoinWalletAddress(userWallet.getMnemonic());
        String cryptoAddressBitcoin = bitcoinWalletAddress.getAddress();
        Token t = tokenService.findByName("Bitcoin");



        WalletAddress walletAddress = new WalletAddress();
        walletAddress.setUserWallet(userWallet);
        walletAddress.setToken(t);
        walletAddress.setPrivateKey(bitcoinWalletAddress.getPrivateKey());
        walletAddress.setPublikKey(bitcoinWalletAddress.getPublicKey());
        walletAddress.setAddress(cryptoAddressBitcoin);

        walletAddressService.save(walletAddress);


    }



    @Test
    void tonInitWallet(){

        User user = userService.findById(1);
        UserWallet userWallet = user.getUserWallet();
        WalletAddressModel tonWalletAddress = walletAddressManager.getTonWalletAddress(userWallet.getMnemonic());
        String cryptoAddressTon = tonWalletAddress.getAddress();
        Token t = tokenService.findByName("Toncoin");



        WalletAddress walletAddress = new WalletAddress();
        walletAddress.setUserWallet(userWallet);
        walletAddress.setToken(t);
        walletAddress.setPrivateKey(tonWalletAddress.getPrivateKey());
        walletAddress.setPublikKey(tonWalletAddress.getPublicKey());
        walletAddress.setAddress(cryptoAddressTon);

        walletAddressService.save(walletAddress);


    }



    @Test
    public void testWalletV5SimpleTransfer1() throws InterruptedException {
        //        byte[] secretKey =
        // Utils.hexToSignedBytes("F182111193F30D79D517F2339A1BA7C25FDF6C52142F0F2C1D960A1F1D65E1E4");
        //        TweetNaclFast.Signature.KeyPair keyPair =
        // TweetNaclFast.Signature.keyPair_fromSeed(secretKey);

        Tonlib tonlib=Tonlib.builder()
                .pathToTonlibSharedLib("tonlibjson.dll")
                .pathToGlobalConfig("testnet-global.config.json")
                .verbosityLevel(VerbosityLevel.FATAL)
                .testnet(true)
                .build();

        TweetNaclFast.Signature.KeyPair keyPair = Utils.generateSignatureKeyPair();
        WalletV5 contract =
                WalletV5.builder()
                        .tonlib(tonlib)
                        .walletId(42)
                        .keyPair(keyPair)
                        .isSigAuthAllowed(true)
                        .build();

        org.ton.java.address.Address walletAddress = contract.getAddress();

        String nonBounceableAddress = walletAddress.toNonBounceable();
        String bounceableAddress = walletAddress.toBounceable();
        log.info("bounceableAddress: {}", bounceableAddress);
        log.info("rawAddress: {}", walletAddress.toRaw());
        log.info("pub-key {}", Utils.bytesToHex(contract.getKeyPair().getPublicKey()));
        log.info("prv-key {}", Utils.bytesToHex(contract.getKeyPair().getSecretKey()));

        BigInteger balance =
                TestnetFaucet.topUpContract(tonlib, Address.of(nonBounceableAddress), Utils.toNano(0.1));
        log.info("new wallet {} balance: {}", contract.getName(), Utils.formatNanoValue(balance));

        // deploy wallet-v5
        ExtMessageInfo extMessageInfo = contract.deploy();
        log.info("extMessageInfo: {}", extMessageInfo);

        contract.waitForDeployment(60);

        long newSeq = contract.getSeqno();


        WalletV5Config walletV5Config =
                WalletV5Config.builder()
                        .seqno(newSeq)
                        .walletId(42)
                        .body(
                                contract
                                        .createBulkTransfer(
                                                Collections.singletonList(
                                                        Destination.builder()
                                                                .bounce(true)
                                                                .address(
                                                                        "0:258e549638a6980ae5d3c76382afd3f4f32e34482dafc3751e3358589c8de00d")
                                                                .mode(3)
                                                                .amount(Utils.toNano(0.05))
                                                                .comment("gift")
                                                                .build()))
                                        .toCell())
                        //                .validUntil(1753376922)
                        .build();

        Message msg = contract.prepareExternalMsg(walletV5Config);
        log.info("msg {}", msg.toCell().toHex());

        extMessageInfo = contract.send(walletV5Config);
        log.info("extMessageInfo: {}", extMessageInfo.toString());

    }




}