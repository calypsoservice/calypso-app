package devtov.calypsoapp.service.web3;


import devtov.calypsoapp.entity.User;
import devtov.calypsoapp.entity.WalletAddress;
import devtov.calypsoapp.service.repository.UserService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.tron.trident.core.ApiWrapper;
import org.tron.trident.core.key.KeyPair;
import org.tron.trident.proto.Chain;
import org.tron.trident.proto.Response;


@Service
@Slf4j
@AllArgsConstructor
public class


TronManager {

    private final UserService userService;

    public void sendTransaction() {
        User user = userService.findById(1);
        WalletAddress walletAddress = user.getUserWallet().getWalletAddresses()
                .stream()
                .filter(a -> a.getToken().getName().equals("Tron"))
                .findFirst()
                .orElse(null);


        KeyPair keyPair = new KeyPair(walletAddress.getPrivateKey());


        String base58CheckAddress = keyPair.toBase58CheckAddress();
        log.info("Base 58 address: {}", base58CheckAddress);

        try {

//            new ApiWrapper();
//            ApiWrapper wrapper = ApiWrapper.ofShasta(walletAddress.getPrivateKey());
            ApiWrapper wrapper = new ApiWrapper( "grpc.trongrid.io:50051", "grpc.trongrid.io:50052",walletAddress.getPrivateKey());
            Response.TransactionExtention transaction = wrapper.transfer("TEjmjXxcqE1ssUostV2y4eLpUQa9fr5eq2", "TPBMsRPBxdvPvVAAsxgHoSpnx5PnTcFKhF", 100);
            Chain.Transaction signedTxn = wrapper.signTransaction(transaction);
            String ret = wrapper.broadcastTransaction(signedTxn);
            log.info("TER: {}", ret);

        } catch (Exception ex) {
            log.warn("Exception send transaction", ex);
        }


    }





}
