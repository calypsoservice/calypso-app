package devtov.calypsoapp.service.repository;

import devtov.calypsoapp.entity.Token;
import devtov.calypsoapp.entity.UserWallet;
import devtov.calypsoapp.entity.WalletAddress;
import devtov.calypsoapp.repository.UserWalletRepository;
import devtov.calypsoapp.repository.WalletAddressRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@AllArgsConstructor
public class WalletAddressService {

    private final WalletAddressRepository walletAddressRepository;


    public WalletAddress save(WalletAddress walletAddress) {
        return walletAddressRepository.save(walletAddress);
    }


    public WalletAddress findById(long id) {
        return walletAddressRepository.findById(id).orElse(null);
    }

    public WalletAddress update(WalletAddress walletAddress) {
        return save(walletAddress);
    }


    public WalletAddress findByAddressAndToken(String address, Token token) {
        return walletAddressRepository.findByAddressAndToken(address, token);
    }


    public List<WalletAddress> findAll() {
        return walletAddressRepository.findAll();
    }


}
