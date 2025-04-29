package devtov.calypsoapp.repository;


import devtov.calypsoapp.entity.Stake;
import devtov.calypsoapp.entity.Token;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StakeRepository extends JpaRepository<Stake, Long> {

}
