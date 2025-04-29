package devtov.calypsoapp.service.web3;

import com.google.common.util.concurrent.FutureCallback;
import com.google.common.util.concurrent.Futures;
import com.google.common.util.concurrent.MoreExecutors;
import jakarta.annotation.PostConstruct;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bitcoinj.core.*;
import org.bitcoinj.kits.WalletAppKit;
import org.bitcoinj.wallet.SendRequest;
import org.bitcoinj.wallet.Wallet;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
@Slf4j
public class BitcoinBlockchainManager {


    private final WalletAppKit walletAppKit;
    private final NetworkParameters networkParameters;

//    @PostConstruct
    public void start() {
        walletAppKit.startAsync();
        walletAppKit.awaitRunning();
    }

    public void send(String value, String to) {
        try {
            Address toAddress = LegacyAddress.fromBase58(networkParameters, to);
            SendRequest sendRequest = SendRequest.to(toAddress, Coin.parseCoin(value));
            sendRequest.feePerKb = Coin.parseCoin("0.0005");
            Wallet.SendResult sendResult = walletAppKit.wallet().sendCoins(walletAppKit.peerGroup(), sendRequest);
            sendResult.broadcastComplete.addListener(() ->
                            System.out.println("Sent coins onwards! Transaction hash is " + sendResult.tx.getTxId()),
                    MoreExecutors.directExecutor());
        } catch (InsufficientMoneyException e) {
            throw new RuntimeException(e);
        }
    }

    public Coin getBalance() {
        return walletAppKit.wallet()
                .getBalance();
    }

}
