package devtov.calypsoapp.service.repository;

import devtov.calypsoapp.entity.Token;
import devtov.calypsoapp.entity.User;
import devtov.calypsoapp.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Objects;

@Service
@Slf4j
@AllArgsConstructor
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;

    public User save(User user) {
        return userRepository.save(user);
    }

    public User update(User user) {
        return save(user);
    }


    public List<User> findAll() {
        return userRepository.findAll();
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public User findByRefValue(String refValue) {
        return userRepository.findByRefValue(refValue);
    }

    public User findById(long id) {
        return userRepository.findById(id).orElse(null);
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email);
    }



    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        User u = findByUsername(username);
        if (Objects.isNull(u)) {
            throw new UsernameNotFoundException(String.format("User %s is not found", username));
        }
        return u;

    }
}
