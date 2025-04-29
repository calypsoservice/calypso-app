import { HDWallet, WalletCore } from "@trustwallet/wallet-core";

const getAddresses = (wallet: HDWallet, core: WalletCore) => {
    const addresses = [
        {
            symbol: "BTC",
            address: wallet.getAddressForCoin(core.CoinType.bitcoin),
            privateAddress: core.HexCoding.encode(wallet.getKeyForCoin(core.CoinType.bitcoin).data()),
            privateAddress2: wallet.getExtendedPrivateKeyDerivation(core.Purpose.bip84, core.CoinType.bitcoin, core.Derivation.bitcoinLegacy, core.HDVersion.zprv)
        },
        {
            symbol: "ETH",
            address: wallet.getAddressForCoin(core.CoinType.ethereum),
            privateAddress: core.HexCoding.encode(wallet.getKeyForCoin(core.CoinType.ethereum).data())
        },
        {
            symbol: "TRX",
            address: wallet.getAddressForCoin(core.CoinType.tron),
            privateAddress: core.HexCoding.encode(wallet.getKeyForCoin(core.CoinType.tron).data())
        },
        {
            symbol: "BNB",
            address: wallet.getAddressForCoin(core.CoinType.smartChain),
            privateAddress: core.HexCoding.encode(wallet.getKeyForCoin(core.CoinType.smartChain).data())
        },
        {
            symbol: "TON",
            address: wallet.getAddressForCoin(core.CoinType.ton),
            privateAddress: core.HexCoding.encode(wallet.getKeyForCoin(core.CoinType.ton).data())
        },
    ]
    return addresses
}

export default getAddresses;