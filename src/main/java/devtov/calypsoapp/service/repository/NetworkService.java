package devtov.calypsoapp.service.repository;

import devtov.calypsoapp.entity.Network;
import devtov.calypsoapp.entity.UserMessage;
import devtov.calypsoapp.repository.NetworkRepository;
import devtov.calypsoapp.repository.UserMessageRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@AllArgsConstructor
public class NetworkService {

    private final NetworkRepository networkRepository;


    public Network save(Network network) {
        return networkRepository.save(network);
    }


    public Network update(Network network) {
        return save(network);
    }


    public List<Network> findAll() {
        return networkRepository.findAll();
    }

    public Network findByName(String name){
        return networkRepository.findByName(name);
    }


}
