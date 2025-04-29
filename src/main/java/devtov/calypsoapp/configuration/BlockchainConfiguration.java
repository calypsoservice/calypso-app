package devtov.calypsoapp.configuration;

import org.bitcoinj.core.ECKey;
import org.bitcoinj.core.NetworkParameters;
import org.bitcoinj.core.PeerAddress;
import org.bitcoinj.kits.WalletAppKit;
import org.bitcoinj.net.discovery.DnsDiscovery;
import org.bitcoinj.params.MainNetParams;
import org.bitcoinj.params.TestNet3Params;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.File;
import java.net.InetAddress;

@Configuration
public class BlockchainConfiguration {

    @Bean
    public NetworkParameters getNetworkParameters() {
        return MainNetParams.get();
    }

    @Bean
    public WalletAppKit walletAppKit(@Autowired NetworkParameters networkParameters) {


        WalletAppKit walletAppKit = new WalletAppKit(networkParameters, new File("."), "btc-file-data") {
            @Override
            protected void onSetupCompleted() {
                if (wallet().getKeyChainGroupSize() < 1) {
                    wallet().importKey(new ECKey());
                }
            }


        };


        walletAppKit.setUserAgent("Sample App", "1.0");
//        walletAppKit
//                .setAutoSave(true);
//                .setBlockingStartup(true);
//        000000000000000000019db679918a126d9ed450575db4bc46cb9e7d7dc09851

        return walletAppKit;
    }


}
