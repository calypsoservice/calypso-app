package devtov.calypsoapp.repository;


import devtov.calypsoapp.entity.Network;
import devtov.calypsoapp.entity.UserMessage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NetworkRepository extends JpaRepository<Network, Long> {
    Network findByName(String name);
}
