package devtov.calypsoapp.service.web3.btc;

public enum AddressFormat {

    BIP84("84"),
    BIP49("49"),
    BIP44("44");

    public final String bip;

     AddressFormat(String bip) {
        this.bip = bip;
    }

}
