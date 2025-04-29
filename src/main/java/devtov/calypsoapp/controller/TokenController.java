package devtov.calypsoapp.controller;

import devtov.calypsoapp.entity.Token;
import devtov.calypsoapp.entity.User;
import devtov.calypsoapp.service.repository.TokenService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/token")
@AllArgsConstructor
@Slf4j
@CrossOrigin
public class TokenController {


    private final TokenService tokenService;


    @PostMapping(path = "/get/all",   produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody List<Token> getAllTokens() {
        return tokenService.findAll();
    }




}
