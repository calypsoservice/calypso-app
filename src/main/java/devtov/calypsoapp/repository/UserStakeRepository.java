package devtov.calypsoapp.repository;


import devtov.calypsoapp.entity.Stake;
import devtov.calypsoapp.entity.UserStake;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserStakeRepository extends JpaRepository<UserStake, Long> {

}
