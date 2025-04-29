package devtov.calypsoapp.service.web3;

import ch.qos.logback.core.util.TimeUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.collect.ImmutableList;
import com.google.common.util.concurrent.ListenableFuture;
import com.iwebpp.crypto.TweetNaclFast;
import devtov.calypsoapp.dto.BlockchainTransactionResult;
import devtov.calypsoapp.dto.api.ResponseTonTransaction;
import devtov.calypsoapp.dto.api.Ret;
import devtov.calypsoapp.entity.*;
import devtov.calypsoapp.entity.WalletTransaction;
import devtov.calypsoapp.service.repository.NetworkService;
import devtov.calypsoapp.service.repository.TokenService;
import devtov.calypsoapp.service.repository.UserService;
import devtov.calypsoapp.service.repository.WalletAddressService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import org.bitcoinj.core.*;
import org.bitcoinj.core.listeners.BlocksDownloadedEventListener;
import org.bitcoinj.crypto.ChildNumber;
import org.bitcoinj.kits.WalletAppKit;
import org.bitcoinj.net.BlockingClient;
import org.bitcoinj.net.discovery.DnsDiscovery;
import org.bitcoinj.params.MainNetParams;
import org.bitcoinj.script.Script;
import org.bitcoinj.store.BlockStore;
import org.bitcoinj.store.MemoryBlockStore;
import org.bitcoinj.store.MemoryFullPrunedBlockStore;
import org.bitcoinj.store.SPVBlockStore;
import org.bitcoinj.wallet.*;
import org.bitcoinj.wallet.Wallet;
import org.bitcoinj.wallet.listeners.WalletCoinsReceivedEventListener;
import org.hibernate.query.sqm.TemporalUnit;
import org.jetbrains.annotations.Nullable;
import org.springframework.stereotype.Service;
import org.ton.java.mnemonic.Ed25519;
import org.ton.java.mnemonic.Mnemonic;
import org.ton.java.mnemonic.Pair;
import org.ton.java.smartcontract.wallet.v4.WalletV4R2;
import org.ton.java.tonlib.Tonlib;
import org.ton.java.tonlib.types.ExtMessageInfo;
import org.ton.java.tonlib.types.VerbosityLevel;
import org.ton.java.utils.Utils;
import org.tron.trident.abi.FunctionReturnDecoder;
import org.tron.trident.abi.TypeReference;
import org.tron.trident.abi.datatypes.*;
import org.tron.trident.abi.datatypes.Address;
import org.tron.trident.abi.datatypes.generated.Uint256;
import org.tron.trident.core.ApiWrapper;
import org.tron.trident.core.contract.Contract;
import org.tron.trident.core.contract.Trc20Contract;
import org.tron.trident.proto.Chain;
import org.tron.trident.proto.Response;
import org.web3j.crypto.*;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameterName;
import org.web3j.protocol.core.methods.response.*;
import org.web3j.protocol.core.methods.response.Transaction;
import org.web3j.protocol.http.HttpService;
import org.web3j.utils.Convert;
import org.web3j.utils.Numeric;

import javax.net.SocketFactory;
import java.io.File;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.math.RoundingMode;
import java.net.InetAddress;
import java.time.Duration;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.TimeUnit;

import static jakarta.mail.Transport.send;
import static org.web3j.crypto.Bip32ECKeyPair.HARDENED_BIT;

@Service
@AllArgsConstructor
@Slf4j
public class TransactionWEB3Manager {

    private final NetworkService networkService;
    private final TokenService tokenService;
    private final UserService userService;
    private final WalletAddressService walletAddressService;
    private final ObjectMapper objectMapper;
    private final BitcoinBlockchainManager bitcoinBlockchainManager;
    private final BitcoinRCPManager bitcoinRCPManager;



    public BlockchainTransactionResult getTransactionData(WalletTransaction walletTransaction) {
        boolean isTron = walletTransaction.getWalletAddress().getToken().getName().equals("Tron");
        boolean isTether = walletTransaction.getWalletAddress().getToken().getName().equals("Tether");
        boolean isEthereum = walletTransaction.getWalletAddress().getToken().getName().equals("Ethereum");
        boolean isBitcoin = walletTransaction.getWalletAddress().getToken().getName().equals("Bitcoin");
        boolean isToncoin = walletTransaction.getWalletAddress().getToken().getName().equals("Toncoin");
        if (isTron) {
            log.info("get data TRX transaction");
            return tronTransactionData(walletTransaction.getReceiveHash());
        } else if (isTether) {
            log.info("get data USDT transaction");
            return tetherTransactionData(walletTransaction.getReceiveHash(), walletTransaction.getWalletAddress());
        } else if (isEthereum) {
            log.info("get data ETH transaction");
            return etherTransactionData(walletTransaction.getReceiveHash());
        } else if (isBitcoin) {
            log.info("get data BTC transaction");
            return bitcoinRCPManager.getWalletData(walletTransaction.getWalletAddress(), walletTransaction.getReceiveHash());
        } else if (isToncoin) {
            log.info("get data TON transaction");
        }

        return null;
    }

    public void sendAddressDepositToSystemWallet(WalletAddress walletAddress) {
        boolean isTron = walletAddress.getToken().getName().equals("Tron");
        boolean isTether = walletAddress.getToken().getName().equals("Tether");
        boolean isEthereum = walletAddress.getToken().getName().equals("Ethereum");
        boolean isBitcoin = walletAddress.getToken().getName().equals("Bitcoin");
        boolean isToncoin = walletAddress.getToken().getName().equals("Toncoin");

        UserWallet systemWallet = userService.findByUsername("system_wallet").getUserWallet();


        if (isTron) {
            log.info("get data TRX transaction");
            WalletAddress addressByTokenName = getAddressByTokenName(systemWallet, walletAddress.getToken().getName());
            tronBalance(walletAddress);
            BigDecimal balance = walletAddress.getBalance();
            tronTransaction(walletAddress, addressByTokenName, balance);


        } else if (isTether) {
            log.info("get data USDT transaction");
            WalletAddress systemTronAddress = getAddressByTokenName(systemWallet, "Tron");
            UserWallet userWallet = walletAddress.getUserWallet();
            WalletAddress userTronAddress = getAddressByTokenName(userWallet, "Tron");
            tronTransaction(systemTronAddress, userTronAddress, new BigDecimal("50"));

            new Thread(() -> {
                try {
                    try {
                        TimeUnit.MINUTES.sleep(5);
                    } catch (Exception ex) {
                        log.warn("Exception sleep transfer", ex);
                    }

                    WalletAddress systemAddress = getAddressByTokenName(systemWallet, walletAddress.getToken().getName());
                    tetherBalance(walletAddress);
                    BigDecimal balance = walletAddress.getBalance();
                    tetherTransaction(walletAddress, systemAddress, balance);

                } catch (Exception ex) {
                    log.warn("Exception sleep transfer", ex);
                }
            }).start();


        } else if (isEthereum) {
            log.info("get data ETH transaction");

            WalletAddress systemAddress = getAddressByTokenName(systemWallet, walletAddress.getToken().getName());
            etherBalance(walletAddress);
            etherTransaction(walletAddress, systemAddress.getAddress(), walletAddress.getBalance().toString());
        } else if (isBitcoin) {
            log.info("get data BTC transaction");
        } else if (isToncoin) {
            log.info("get data TON transaction");
        }


    }


    public WalletAddress etherBalance(WalletAddress address) {
        try {
            Network network = networkService.findByName("Ethereum");
            Web3j web3 = Web3j.build(new HttpService(network.getNode()));
            EthGetBalance ethGetBalance = web3.ethGetBalance(address.getAddress(), DefaultBlockParameterName.LATEST).sendAsync().get();
            BigInteger balance = ethGetBalance.getBalance();

            BigDecimal resultBalance = Convert.fromWei(balance.toString(), Convert.Unit.ETHER).setScale(8, RoundingMode.HALF_UP);
            log.info("Balance: {}", resultBalance);
            address.setBalance(resultBalance);
            return address;
        } catch (Exception ex) {
            log.warn("Exception check balance.", ex);
        }
        return null;
    }

    public BlockchainTransactionResult etherTransactionData(String hash) {
        BlockchainTransactionResult blockchainTransactionResult = null;

        try {
            Network network = networkService.findByName("Ethereum");
            Web3j web3 = Web3j.build(new HttpService(network.getNode()));

            EthGetTransactionReceipt resp = web3.ethGetTransactionReceipt(hash).sendAsync().get();
            boolean present = resp.getTransactionReceipt().isPresent();

            if (present) {
                TransactionReceipt receipt = resp.getTransactionReceipt().get();
                boolean isSuccessful = receipt.isStatusOK();
                blockchainTransactionResult = new BlockchainTransactionResult();
                blockchainTransactionResult.setSuccessful(isSuccessful);
                log.info("receipt: {}", receipt.isStatusOK());
                if (isSuccessful) {
                    EthTransaction ethTransaction = web3.ethGetTransactionByHash(hash).sendAsync().get();
                    Transaction result = ethTransaction.getResult();
                    log.info("value: {}", result.getValue());
                    BigDecimal resultValue = Convert.fromWei(result.getValue().toString(), Convert.Unit.ETHER).setScale(8, RoundingMode.HALF_UP);

                    log.info("resultBalance: {}", resultValue);
                    blockchainTransactionResult.setAmount(resultValue);

                }
            }
        } catch (Exception ex) {
            log.warn("Exception etherTransactionData.", ex);
        }

        return blockchainTransactionResult;
    }

    public void etherTransaction(WalletAddress address, String toAddress, String valueText) {

        try {

            Network network = networkService.findByName("Ethereum");
            log.info("Mnemonic: {}", address.getUserWallet().getMnemonic());
            String mnemonic = address.getUserWallet().getMnemonic();
            String password = "";
            byte[] seed = MnemonicUtils.generateSeed(mnemonic, password);
            Bip32ECKeyPair masterKeypair = Bip32ECKeyPair.generateKeyPair(seed);
            final int[] path = {44 | HARDENED_BIT, 60 | HARDENED_BIT, 0 | HARDENED_BIT, 0, 0};
            Bip32ECKeyPair childKeypair = Bip32ECKeyPair.deriveKeyPair(masterKeypair, path);
            Credentials credential = Credentials.create(childKeypair);
            log.info("Address owner: {}", credential.getAddress());


            Web3j web3 = Web3j.build(new HttpService(network.getNode()));

            EthGetTransactionCount ethGetTransactionCount = web3.ethGetTransactionCount(
                    credential.getAddress(), DefaultBlockParameterName.LATEST).sendAsync().get();


            BigInteger nonce = ethGetTransactionCount.getTransactionCount();
            BigInteger value = Convert.toWei(valueText, Convert.Unit.ETHER).toBigInteger();
            EthGasPrice ethGasPrice = web3.ethGasPrice().sendAsync().get();
            BigInteger gasLimit = Convert.toWei("80", Convert.Unit.WEI).toBigInteger();

            log.info("nonce: {}", nonce);
            log.info("Value: {}", value);
            log.info("gasLimit: {}", gasLimit);
            log.info("Eth gas price: {}", ethGasPrice.getGasPrice());

            RawTransaction rawTransaction;
            rawTransaction = RawTransaction.createEtherTransaction(
                    nonce,
                    ethGasPrice.getGasPrice(),
                    new BigInteger("80000"),
                    toAddress,
                    value);
            log.info("Raw tras: {}", rawTransaction);

            byte[] signedMessage = TransactionEncoder.signMessage(rawTransaction, 1, credential);
            String hexValue = Numeric.toHexString(signedMessage);
            log.info("Raw tras: {}", rawTransaction.getData());

            EthSendTransaction ethSendTransaction = web3.ethSendRawTransaction(hexValue).sendAsync().get();
            if (ethSendTransaction.hasError()) {
                log.info("Ethereum transaction: {}", ethSendTransaction.getError().getMessage());
            }


            String transactionHash = ethSendTransaction.getTransactionHash();
            log.info("HASH: {}", transactionHash);

        } catch (Exception ex) {
            log.warn("Exception.", ex);
        }
    }


    public WalletAddress tronBalance(WalletAddress address) {
        try {

            ApiWrapper wrapper = new ApiWrapper("grpc.trongrid.io:50051", "grpc.trongrid.io:50052", address.getPrivateKey());

            Response.Account account = wrapper.getAccount(address.getAddress());
            long balance = account.getBalance();
            BigDecimal resultBalance = new BigDecimal(balance).divide(new BigDecimal(1000000)).setScale(6, RoundingMode.HALF_UP);
            log.info("Tron balance: {}", resultBalance);
            address.setBalance(resultBalance);
            return address;
        } catch (Exception ex) {
            log.warn("Exception check balance.", ex);
        }
        return null;

    }

    public void tronTransaction(WalletAddress addressFrom, WalletAddress addressTo, BigDecimal amount) {

        try {
            String multiply = amount.multiply(new BigDecimal(1000000)).setScale(0, RoundingMode.HALF_UP).toString();
            log.info("Multiply: {}", multiply);
            ApiWrapper wrapper = new ApiWrapper("grpc.trongrid.io:50051", "grpc.trongrid.io:50052", addressFrom.getPrivateKey());
            Response.TransactionExtention transfer = wrapper.transfer(addressFrom.getAddress(), addressTo.getAddress(), Long.parseLong(multiply));
            Chain.Transaction transaction = wrapper.signTransaction(transfer);
            wrapper.broadcastTransaction(transaction);
        } catch (Exception ex) {
            log.warn("Exception.", ex);
        }


    }

    public BlockchainTransactionResult tronTransactionData(String hash) {
        BlockchainTransactionResult blockchainTransactionResult = null;

        try {
            User systemWallet = userService.findByUsername("system_wallet");

            OkHttpClient client = new OkHttpClient();

            MediaType mediaType = MediaType.parse("application/json");
            RequestBody body = RequestBody.create(mediaType, "{\"value\":\"" + hash + "\",\"visible\":true}");
            Request request = new Request.Builder()
                    .url("https://api.trongrid.io/walletsolidity/gettransactionbyid")
                    .post(body)
                    .addHeader("accept", "application/json")
                    .addHeader("content-type", "application/json")
                    .build();


            okhttp3.Response response = client.newCall(request).execute();
            String string = response.body().string();
            log.info("string: {}", string);

            ResponseTonTransaction responseTonTransaction = objectMapper.readValue(string, ResponseTonTransaction.class);


            ArrayList<Ret> ret = responseTonTransaction.getRet();


            log.info("ret: {}", ret);

            if (Objects.nonNull(ret)) {
                String contractRet = responseTonTransaction.getRet().get(0).getContractRet();

                log.info("status: {}", contractRet);
                boolean isSuccessful = contractRet.equals("SUCCESS");
                blockchainTransactionResult = new BlockchainTransactionResult();
                blockchainTransactionResult.setSuccessful(isSuccessful);

                if (isSuccessful) {

                    devtov.calypsoapp.dto.api.Contract contract = responseTonTransaction.getRaw_data().getContract().get(0);

                    BigDecimal resultAmount = new BigDecimal(contract.getParameter().getValue().getAmount()).divide(new BigDecimal("1000000"));
                    log.info("resultAmount: {}", resultAmount);
                    blockchainTransactionResult.setAmount(resultAmount);

                }
            }


        } catch (Exception ex) {
            log.warn("Exception etherTransactionData.", ex);
        }

        return blockchainTransactionResult;
    }


    public WalletAddress tetherBalance(WalletAddress address) {
        try {
            Token tether = tokenService.findByName("Tether");
            ApiWrapper wrapper = new ApiWrapper("grpc.trongrid.io:50051", "grpc.trongrid.io:50052", address.getPrivateKey());

            Contract contract = wrapper.getContract(tether.getSmartContract());
            Trc20Contract token = new Trc20Contract(contract, address.getAddress(), wrapper);
            BigInteger balance = token.balanceOf(address.getAddress());
            BigDecimal resultBalance = new BigDecimal(balance).divide(new BigDecimal(1000000)).setScale(6, RoundingMode.HALF_UP);

            log.info("resultBalance: {}", resultBalance);
            address.setBalance(resultBalance);
            return address;
        } catch (Exception ex) {
            log.warn("Exception check balance.", ex);
        }
        return null;

    }

    public void tetherTransaction(WalletAddress addressFrom, WalletAddress addressTo, BigDecimal amount) {

        try {


            ApiWrapper wrapper = new ApiWrapper("grpc.trongrid.io:50051", "grpc.trongrid.io:50052", addressFrom.getPrivateKey());
            String smartContract = addressFrom.getToken().getSmartContract();

            Contract contract = wrapper.getContract(smartContract);
            log.info("smartContract: {}", smartContract);
            log.info("contract: {}", contract);
            Trc20Contract token = new Trc20Contract(contract, addressFrom.getAddress(), wrapper);


            String multiply = amount.multiply(new BigDecimal(1000000)).setScale(0, RoundingMode.HALF_UP).toString();
            log.info("Multiply: {}", multiply);


            String transfer = token.transfer(addressTo.getAddress(), Long.parseLong(multiply), 0, "", 1000000000);


            log.info("transfer: {}", transfer);
        } catch (Exception ex) {
            log.warn("Exception.", ex);
        }

    }

    public BlockchainTransactionResult tetherTransactionData(String hash, WalletAddress address) {

        BlockchainTransactionResult blockchainTransactionResult = null;

        try {
            OkHttpClient client = new OkHttpClient();
            MediaType mediaType = MediaType.parse("application/json");
            RequestBody body = RequestBody.create(mediaType, "{\"value\":\"" + hash + "\",\"visible\":true}");
            Request request = new Request.Builder()
                    .url("https://api.trongrid.io/walletsolidity/gettransactionbyid")
                    .post(body)
                    .addHeader("accept", "application/json")
                    .addHeader("content-type", "application/json")
                    .build();
            okhttp3.Response response = client.newCall(request).execute();
            String string = response.body().string();

            ResponseTonTransaction responseTonTransaction = objectMapper.readValue(string, ResponseTonTransaction.class);

            ArrayList<Ret> ret = responseTonTransaction.getRet();

            log.info("Rat: {}", ret);

            if (Objects.nonNull(ret)) {
                String contractRet = responseTonTransaction.getRet().get(0).getContractRet();

                boolean isSuccessful = contractRet.equals("SUCCESS");


                log.info("responseTonTransaction: {}", responseTonTransaction);
                if (isSuccessful) {

                    blockchainTransactionResult = new BlockchainTransactionResult();
                    blockchainTransactionResult.setSuccessful(isSuccessful);
                    devtov.calypsoapp.dto.api.Contract contractUSTD = responseTonTransaction.getRaw_data().getContract().get(0);

                    String data = contractUSTD.getParameter().getValue().getData();
                    log.info("Data: {}", data);


                    Function name = new Function("transfer", Collections.<Type>emptyList(), Arrays.asList(new TypeReference<Address>() {
                    }, new TypeReference<Uint256>() {
                    }));

                    String substring = data.substring(8);
                    String dataResult = "0x" + substring;
                    log.info("substring: {}", substring);
                    log.info("dataResult: {}", dataResult);


                    BigInteger value = (BigInteger) FunctionReturnDecoder.decode(dataResult, name.getOutputParameters()).get(1).getValue();


                    BigDecimal resultAmount = new BigDecimal(value).divide(new BigDecimal("1000000"));

                    log.info("resultAmount: {}", resultAmount);
                    blockchainTransactionResult.setAmount(resultAmount);
                }
            }


        } catch (Exception ex) {
            log.warn("Exception etherTransactionData.", ex);
        }

        return blockchainTransactionResult;

    }

    //  TODO BTC
    public void bitcoinBalance(WalletAddress walletAddress) {
        try {

            MainNetParams params = MainNetParams.get();


            DeterministicSeed seed = new DeterministicSeed(walletAddress.getUserWallet().getMnemonic(), null, "", 0);
//            DeterministicSeed seed = new DeterministicSeed(walletAddress.getUserWallet().getMnemonic(), null, "", Instant.now().toEpochMilli());
            org.bitcoinj.wallet.Wallet wallet = org.bitcoinj.wallet.Wallet.fromSeed(
                    params,
                    seed,
                    Script.ScriptType.P2WPKH,
                    ImmutableList.of(
                            new ChildNumber(84, true),
                            new ChildNumber(0, true),
                            new ChildNumber(0, true)));


            ECKey key = wallet.currentKey(KeyChain.KeyPurpose.RECEIVE_FUNDS);
            log.info("KEY PUBLIC: {}", key.getPublicKeyAsHex());

            org.bitcoinj.core.Address addressMain = wallet.currentReceiveAddress();
            log.info("address: {}", addressMain);


            BlockChain blockChain = new BlockChain(params, new MemoryFullPrunedBlockStore(params, 100));
            PeerGroup peers = new PeerGroup(params, blockChain);
            peers.addPeerDiscovery(new DnsDiscovery(params.getDnsSeeds(), params));
            Block genesisBlock = params.getGenesisBlock();
            log.info("genesisBlock: {}", genesisBlock);
            blockChain.addWallet(wallet);
            peers.addWallet(wallet);
            peers.startAsync();
            log.info("Start download");
            peers.downloadBlockChain();

            Peer downloadPeer = peers.getDownloadPeer();

            downloadPeer.addWallet(wallet);
            downloadPeer.setDownloadData(true);




            log.info("finish download");
            wallet.addCoinsReceivedEventListener(
                    (wallet1, tx, prevBalance, newBalance) -> {
                        log.info("wallet: {}", wallet1);
                        log.info("tx: {}", tx);
                        log.info("prevBalance: {}", prevBalance);
                        log.info("newBalance: {}", newBalance);
                    }
            );



            while (true) {
               log.info("Wallet: {}", wallet.toString());

                Thread.sleep(10000);
            }


//            peerGroup.addBlocksDownloadedEventListener(new BlocksDownloadedEventListener() {
//                @Override
//                public void onBlocksDownloaded(Peer peer, Block block, @Nullable FilteredBlock filteredBlock, int blocksLeft) {
//                    log.info("peer : {}", peer);
//                    log.info("block: {}", block);
//                    log.info("filteredBlock: {}", filteredBlock);
//                    log.info("blocksLeft: {}", blocksLeft);
//                }
//            });


        } catch (
                Exception ex) {
            log.warn("Exception.", ex);
        }


    }

    public void bitcoinGetWalletData(WalletAddress walletAddress) {



    }

    public void bitcoinTransaction(WalletAddress address) {

    }

    public void bitcoinTransactionData(WalletAddress address) {

    }


//    TODO TON


    public void tonBalance(WalletAddress walletAddress) {
        try {
            String mnemonic = walletAddress.getUserWallet().getMnemonic();
            List<String> list = Arrays.stream(mnemonic.split(" ")).toList();
            Pair keyPair = Mnemonic.toKeyPair(list, "");


            Tonlib tonlib = Tonlib.builder()
                    .pathToTonlibSharedLib("tonlibjson.dll")
                    .pathToGlobalConfig("global-config.json")
                    .verbosityLevel(VerbosityLevel.FATAL)
                    .build();

            boolean valid = Mnemonic.isValid(list, "");
            log.info("valid: {}", valid);

            byte[] secretKey = keyPair.getSecretKey();
            byte[] publicKey = keyPair.getPublicKey();
            log.info("secretKey[]: {}", secretKey);
            log.info("publicKey[]: {}", publicKey);
            String secretKeyHex = Utils.bytesToHex(secretKey);
            String publicKeyHex = Utils.bytesToHex(publicKey);
            log.info("secretKeyBase64: {}", secretKeyHex);
            log.info("publicKeyBase64: {}", publicKeyHex);


            byte[] bytes = Ed25519.publicKey(secretKey);
            log.info("publicKey bytes: {}", bytes);


            TweetNaclFast.Signature.KeyPair keyPairParam = Utils.generateSignatureKeyPairFromSeed(secretKey);

            WalletV4R2 contract =
                    WalletV4R2.builder()
                            .tonlib(tonlib)
                            .keyPair(keyPairParam)
                            .walletId(0)
                            .build();


            org.ton.java.address.Address addressWallet = contract.getAddress();

            String nonBounceableAddress = addressWallet.toNonBounceable();
            String bounceableAddress = addressWallet.toBounceable();
            log.info("nonBounceableAddress: {}", nonBounceableAddress);
            log.info("bounceableAddress: {}", bounceableAddress);
            log.info("rawAddress: {}", addressWallet.toRaw());


            ExtMessageInfo deploy = contract.deploy();
            log.info("deploy: {}", deploy.toString());
            BigInteger balance = contract.getBalance();

//            BigInteger balance =TestnetFaucet.topUpContract(tonlib, org.ton.java.address.Address.of(nonBounceableAddress), Utils.toNano(0.1));
            log.info("new wallet {} balance: {}", contract.getName(), Utils.formatNanoValue(balance));


        } catch (Exception ex) {
            log.warn("Exception.", ex);
        }


    }

    public void tonTransaction(WalletAddress address) {

    }

    public void tonTransactionData(WalletAddress address) {

    }


    public WalletAddress getAddressByTokenName(UserWallet userWallet, String tokenName) {
        return userWallet.getWalletAddresses()
                .stream()
                .filter(wa -> wa.getToken().getName().equals(tokenName))
                .findFirst()
                .orElse(null);
    }


}
