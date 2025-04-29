package devtov.calypsoapp.service.web3.btc;

public class Blockchain {

    // Target URL of Blockchain.info
    private static final String TARGET_URL = "https://blockchain.info/";



    public static double getBalance(String address) {

        double balance = 0;
        String url = TARGET_URL + "balance?active=" + address;
        String balanceTag = "\""+address+"\":{\"final_balance\":";

        String response = BlockchainHTTP.blockchainRequest(url);

        if (response.indexOf(balanceTag) != -1) {
            balance = Double.parseDouble(response.substring(response.indexOf(balanceTag)+balanceTag.length(),response.indexOf(',') ));
            balance = balance / 100000000f;
        }

        return balance;
    }

    public static double btcToCurrency(double balance, String currency) {

        String url = TARGET_URL + "ticker";
        String response = BlockchainHTTP.blockchainRequest(url);
        String balanceTag = "\"sell\": ";
        double btcInCurrency;

        if (response.indexOf(currency.toUpperCase()) != -1) {
            response = response.substring(response.indexOf(currency.toUpperCase()));
            response = response.substring(response.indexOf(balanceTag));
            btcInCurrency = Double.parseDouble(response.substring(response.indexOf(balanceTag)+balanceTag.length(), response.indexOf(',')));
            balance = balance * btcInCurrency;
        }

        return balance;
    }

}
