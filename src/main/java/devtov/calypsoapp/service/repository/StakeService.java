package devtov.calypsoapp.service.repository;

import devtov.calypsoapp.entity.Stake;
import devtov.calypsoapp.entity.Token;
import devtov.calypsoapp.repository.StakeRepository;
import devtov.calypsoapp.repository.TokenRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@AllArgsConstructor
public class StakeService {

    private final StakeRepository stakeRepository;


    public Stake save(Stake stake) {
        return stakeRepository.save(stake);
    }


    public Stake update(Stake stake) {
        return save(stake);
    }

    public Stake findById(long id) {
        return stakeRepository.findById(id).orElse(null);
    }


    public List<Stake> findAll() {
        return stakeRepository.findAll();
    }


}
