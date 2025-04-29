package devtov.calypsoapp.controller;

import devtov.calypsoapp.dto.UserModel;
import devtov.calypsoapp.entity.User;
import devtov.calypsoapp.service.app.UserManager;
import devtov.calypsoapp.service.repository.UserService;
import devtov.calypsoapp.service.web3.TransactionWEB3Manager;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
@AllArgsConstructor
@Slf4j
@CrossOrigin
public class  UserController {

    private final UserService userService;
    private final TransactionWEB3Manager transactionWEB3Manager;
    private final UserManager userManager;

    @PostMapping(path = "/get/all", produces = "application/json", consumes = "application/json")
    public ResponseEntity<List<User>> getAll() {
        log.info("Get all users");
        List<User> userList = userService.findAll();
        return ResponseEntity.status(200).body(userList);
    }

    @PostMapping(path = "/get/username", produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody User getUser(@RequestBody UserModel userModel) {
        User userFullData = userManager.getUserFullData(userModel);
        return userFullData;
    }

}
