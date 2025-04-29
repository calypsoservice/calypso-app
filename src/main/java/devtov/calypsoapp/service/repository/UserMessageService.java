package devtov.calypsoapp.service.repository;

import devtov.calypsoapp.entity.User;
import devtov.calypsoapp.entity.UserMessage;
import devtov.calypsoapp.repository.UserMessageRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@AllArgsConstructor
public class UserMessageService {

    private final UserMessageRepository userMessageRepository;


    public UserMessage save(UserMessage userMessage) {
        return userMessageRepository.save(userMessage);
    }


    public UserMessage update(UserMessage userMessage) {
        return save(userMessage);
    }


    public UserMessage findById(long id) {
        return userMessageRepository.findById(id).orElse(null);
    }


    public void delete(UserMessage userMessage) {
        userMessageRepository.delete(userMessage);
    }


    public List<UserMessage> findAll() {
        return userMessageRepository.findAll();
    }


    public List<UserMessage> findAllByUser(User user) {
        return userMessageRepository.findAllByUser(user);
    }

}
