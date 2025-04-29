package devtov.calypsoapp.repository;


import devtov.calypsoapp.entity.User;
import devtov.calypsoapp.entity.UserMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserMessageRepository extends JpaRepository<UserMessage, Long> {
    List<UserMessage> findAllByUser(User user);
}
