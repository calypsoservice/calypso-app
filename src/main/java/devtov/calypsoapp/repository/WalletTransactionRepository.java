package devtov.calypsoapp.repository;


import devtov.calypsoapp.entity.UserWallet;
import devtov.calypsoapp.entity.WalletTransaction;
import devtov.calypsoapp.entity.WalletTransactionStatus;
import devtov.calypsoapp.entity.WalletTransactionType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WalletTransactionRepository extends JpaRepository<WalletTransaction, Long> {
    WalletTransaction findByHash(String hash);

    List<WalletTransaction> findAllByReceiveHash(String receiveHash);

    List<WalletTransaction> findAllByTypeAndStatus(WalletTransactionType type, WalletTransactionStatus status);
}
