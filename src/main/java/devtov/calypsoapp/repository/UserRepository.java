package devtov.calypsoapp.repository;


import devtov.calypsoapp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
    User findByEmail(String email);
    User findByRefValue(String refValue);
//    User findByVerifyEmailText(String verifyEmailText);
}
