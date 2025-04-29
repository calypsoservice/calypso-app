package devtov.calypsoapp.repository;


import devtov.calypsoapp.entity.WalletTransaction;
import devtov.calypsoapp.entity.WalletTransactionStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WalletTransactionStatusRepository extends JpaRepository<WalletTransactionStatus, Long> {
    WalletTransactionStatus findByStatus(String status);
}
