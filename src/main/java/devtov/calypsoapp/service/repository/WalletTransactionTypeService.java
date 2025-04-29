package devtov.calypsoapp.service.repository;

import devtov.calypsoapp.entity.WalletTransactionStatus;
import devtov.calypsoapp.entity.WalletTransactionType;
import devtov.calypsoapp.repository.WalletTransactionStatusRepository;
import devtov.calypsoapp.repository.WalletTransactionTypeRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@AllArgsConstructor
public class WalletTransactionTypeService {

    private final WalletTransactionTypeRepository walletTransactionTypeRepository;


    public WalletTransactionType save(WalletTransactionType walletTransactionStatus) {
        return walletTransactionTypeRepository.save(walletTransactionStatus);
    }

    public WalletTransactionType findById(long id) {
        return walletTransactionTypeRepository.findById(id).orElse(null);
    }

    public WalletTransactionType update(WalletTransactionType userMessage) {
        return save(userMessage);
    }

    public List<WalletTransactionType> findAll() {
        return walletTransactionTypeRepository.findAll();
    }


    public WalletTransactionType findByType(String type) {
        return walletTransactionTypeRepository.findByType(type);
    }


}
