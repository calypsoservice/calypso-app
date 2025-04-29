package devtov.calypsoapp.service.web3;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.thetransactioncompany.jsonrpc2.JSONRPC2Request;
import com.thetransactioncompany.jsonrpc2.JSONRPC2Response;
import com.thetransactioncompany.jsonrpc2.client.JSONRPC2Session;
import com.thetransactioncompany.jsonrpc2.client.JSONRPC2SessionOptions;
import devtov.calypsoapp.dto.BitcoinTransDataModel;
import devtov.calypsoapp.dto.BlockchainTransactionResult;
import devtov.calypsoapp.entity.WalletAddress;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.minidev.json.JSONObject;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.net.URL;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
@AllArgsConstructor
public class BitcoinRCPManager {

    private final String RCP_URL = "https://go.getblock.io/dc7ff2d7b0394078a2843f35ca6e2559";
    private final ObjectMapper objectMapper;

    public BlockchainTransactionResult getWalletData(WalletAddress walletAddress, String hash) {


        try {

            URL url = new URL(RCP_URL);
            JSONRPC2Session mySession = new JSONRPC2Session(url);
            mySession.getOptions().setRequestContentType("application/json");
            String method = "getrawtransaction";
            int requestID = 0;
            JSONRPC2Request request = new JSONRPC2Request(method, requestID);
            request.setPositionalParams(Arrays.asList(hash, true));

            log.info("request: {}", request.toJSONString());

            JSONRPC2Response response = mySession.send(request);

            String result = response.toJSONObject().toJSONString().replace("{\"result\":", "").replace(",\"id\":0,\"jsonrpc\":\"2.0\"}", "");
            log.info("response: {}", result);

            int i2 = result.indexOf("confirmations");
            int i = result.indexOf("address");
            int i1 = result.indexOf("value");
            log.info("i: {}", i);
            log.info("i: {}", i1);
            log.info("i: {}", i2);

            String confirmationText = result.substring(i2 + 15, result.indexOf(",", i2));
            String addressText = result.substring(i + 10, result.indexOf(",", i) - 1);
            String valueText = result.substring(i1 + 7, result.indexOf(",", i1));

            BigDecimal value = new BigDecimal(valueText);
            int confirmation = Integer.parseInt(confirmationText);

            log.info("value: {}", value);
            log.info("confirmation: {}", confirmation);
            log.info("addressText: {}", addressText);

            boolean validAddress = walletAddress.getAddress().equals(addressText);
            BlockchainTransactionResult blockchainTransactionResult = new BlockchainTransactionResult(validAddress, value);

            return blockchainTransactionResult;

        } catch (Exception e) {
            log.warn("Exception.", e);
        }

        return null;
    }

}
