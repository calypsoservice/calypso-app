package devtov.calypsoapp.service.web3.btc;

import java.math.BigInteger;

public class Wallet {
    private String address;
    private Mnemonic mnemonic;
    private AddressFormat addressFormat = AddressFormat.BIP84;

    public Wallet(BigInteger entropy) {

        this.mnemonic = new Mnemonic(entropy);
        this.address = Algorithms.generateAddress(this.mnemonic.getMasterKeys().derivateFirstKey(addressFormat).getPublicKey(),addressFormat);

    }

    public Wallet(String mnemonicPhrase) {

        this.mnemonic = new Mnemonic(mnemonicPhrase);
        this.address = Algorithms.generateAddress(this.mnemonic.getMasterKeys().derivateFirstKey(addressFormat).getPublicKey(),addressFormat);

    }

    public Wallet() {
        this.mnemonic = Mnemonic.randomMnemonic();
        this.address = Algorithms.generateAddress(this.mnemonic.getMasterKeys().derivateFirstKey(addressFormat).getPublicKey(),addressFormat);
    }

    public void changeAddressFormat(AddressFormat addressFormat) {
        this.addressFormat = addressFormat;
        this.address = Algorithms.generateAddress(this.mnemonic.getMasterKeys().derivateFirstKey(addressFormat).getPublicKey(),addressFormat);
    }


    public double getBalance() {
        return Blockchain.getBalance(this.address);
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Mnemonic getMnemonic() {
        return mnemonic;
    }

    public void setMnemonic(Mnemonic mnemonic) {
        this.mnemonic = mnemonic;
    }

    public AddressFormat getAddressFormat() {
        return addressFormat;
    }

    public void setAddressFormat(AddressFormat addressFormat) {
        this.addressFormat = addressFormat;
    }

}
