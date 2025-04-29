package devtov.calypsoapp.service.repository;

import devtov.calypsoapp.entity.WalletTransaction;
import devtov.calypsoapp.entity.WalletTransactionStatus;
import devtov.calypsoapp.repository.WalletTransactionRepository;
import devtov.calypsoapp.repository.WalletTransactionStatusRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@AllArgsConstructor
public class WalletTransactionStatusService {

    private final WalletTransactionStatusRepository walletTransactionStatusRepository;


    public WalletTransactionStatus save(WalletTransactionStatus walletTransactionStatus) {
        return walletTransactionStatusRepository.save(walletTransactionStatus);
    }


    public WalletTransactionStatus findByStatus(String status) {
        return walletTransactionStatusRepository.findByStatus(status);
    }

    public WalletTransactionStatus findById(long id) {
        return walletTransactionStatusRepository.findById(id).orElse(null);
    }

    public WalletTransactionStatus update(WalletTransactionStatus userMessage) {
        return save(userMessage);
    }

    public List<WalletTransactionStatus> findAll() {
        return walletTransactionStatusRepository.findAll();
    }

}
