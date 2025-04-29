package devtov.calypsoapp.repository;


import devtov.calypsoapp.entity.Token;
import devtov.calypsoapp.entity.UserWallet;
import devtov.calypsoapp.entity.WalletAddress;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WalletAddressRepository extends JpaRepository<WalletAddress, Long> {
    WalletAddress findByAddressAndToken(String address, Token token);
}
