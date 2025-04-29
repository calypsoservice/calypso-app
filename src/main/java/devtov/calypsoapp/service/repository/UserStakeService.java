package devtov.calypsoapp.service.repository;

import devtov.calypsoapp.entity.Stake;
import devtov.calypsoapp.entity.UserStake;
import devtov.calypsoapp.repository.StakeRepository;
import devtov.calypsoapp.repository.UserStakeRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@AllArgsConstructor
public class UserStakeService {

    private final UserStakeRepository userStakeRepository;


    public UserStake save(UserStake userStake) {
        return userStakeRepository.save(userStake);
    }

    public UserStake findById(long id) {
        return userStakeRepository.findById(id).orElse(null);
    }


    public UserStake update(UserStake userStake) {
        return save(userStake);
    }

    public List<UserStake> findAll() {
        return userStakeRepository.findAll();
    }


}
