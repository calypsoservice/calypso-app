package devtov.calypsoapp.repository;


import devtov.calypsoapp.entity.WalletTransaction;
import devtov.calypsoapp.entity.WalletTransactionType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WalletTransactionTypeRepository extends JpaRepository<WalletTransactionType, Long> {
        WalletTransactionType findByType(String type);
}
