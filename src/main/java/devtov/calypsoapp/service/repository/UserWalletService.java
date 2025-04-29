package devtov.calypsoapp.service.repository;

import devtov.calypsoapp.entity.Network;
import devtov.calypsoapp.entity.UserWallet;
import devtov.calypsoapp.repository.NetworkRepository;
import devtov.calypsoapp.repository.UserWalletRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@AllArgsConstructor
public class UserWalletService {

    private final UserWalletRepository userWalletRepository;


    public UserWallet save(UserWallet userWallet) {
        return userWalletRepository.save(userWallet);
    }


    public UserWallet update(UserWallet userWallet) {
        return save(userWallet);
    }


    public List<UserWallet> findAll() {
        return userWalletRepository.findAll();
    }


}
