package devtov.calypsoapp.service.repository;

import devtov.calypsoapp.entity.Network;
import devtov.calypsoapp.entity.Stake;
import devtov.calypsoapp.entity.Token;
import devtov.calypsoapp.repository.NetworkRepository;
import devtov.calypsoapp.repository.TokenRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@AllArgsConstructor
public class TokenService {

    private final TokenRepository tokenRepository;


    public Token save(Token token) {
        return tokenRepository.save(token);
    }

    public Token findById(long id) {
        return tokenRepository.findById(id).orElse(null);
    }

    public List<Token> findBySymbol(String symbol) {
        return tokenRepository.findAllBySymbol(symbol);
    }


    public Token update(Token token) {
        return save(token);
    }


    public Token findByName(String name) {
        return tokenRepository.findByName(name);
    }


    public List<Token> findAll() {
        return tokenRepository.findAll();
    }


}
