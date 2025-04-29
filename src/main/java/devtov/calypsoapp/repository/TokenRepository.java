package devtov.calypsoapp.repository;


import devtov.calypsoapp.entity.Network;
import devtov.calypsoapp.entity.Token;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TokenRepository extends JpaRepository<Token, Long> {
    Token findByName(String name);
    List<Token> findAllBySymbol(String symbol);
}
