package devtov.calypsoapp.service.repository;

import devtov.calypsoapp.entity.UserMessage;
import devtov.calypsoapp.entity.WalletTransaction;
import devtov.calypsoapp.entity.WalletTransactionStatus;
import devtov.calypsoapp.entity.WalletTransactionType;
import devtov.calypsoapp.repository.UserMessageRepository;
import devtov.calypsoapp.repository.WalletTransactionRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@AllArgsConstructor
public class WalletTransactionService {

    private final WalletTransactionRepository walletTransactionRepository;


    public WalletTransaction save(WalletTransaction walletTransaction) {
        return walletTransactionRepository.save(walletTransaction);
    }

    public WalletTransaction findByHash(String hash) {
        return walletTransactionRepository.findByHash(hash);
    }


    public List<WalletTransaction> findAllByReceiveHash(String receiveHash) {
        return walletTransactionRepository.findAllByReceiveHash(receiveHash);
    }

    public WalletTransaction findById(long id) {
        return walletTransactionRepository.findById(id).orElse(null);
    }

    public List<WalletTransaction> findByTypeAndStatus(WalletTransactionType type , WalletTransactionStatus status) {
        return walletTransactionRepository.findAllByTypeAndStatus(type, status);
    }




    public WalletTransaction update(WalletTransaction walletTransaction) {
        return save(walletTransaction);
    }

    public List<WalletTransaction> findAll() {
        return walletTransactionRepository.findAll();
    }

}
