package devtov.calypsoapp.repository;


import devtov.calypsoapp.entity.Network;
import devtov.calypsoapp.entity.UserWallet;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserWalletRepository extends JpaRepository<UserWallet, Long> {

}
