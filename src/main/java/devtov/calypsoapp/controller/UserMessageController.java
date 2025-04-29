package devtov.calypsoapp.controller;

import devtov.calypsoapp.dto.UserMessageModel;
import devtov.calypsoapp.dto.UserModel;
import devtov.calypsoapp.entity.User;
import devtov.calypsoapp.entity.UserMessage;
import devtov.calypsoapp.service.repository.UserMessageService;
import devtov.calypsoapp.service.repository.UserService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/message")
@AllArgsConstructor
@Slf4j
@CrossOrigin
public class UserMessageController {

    private final UserService userService;
    private final UserMessageService userMessageService;


    @PostMapping(path = "/save", consumes = "application/json", produces = "application/json")
    public ResponseEntity<?> saveUserMessage(@RequestBody UserMessageModel userMessageModel) {
        User user = userService.findById(userMessageModel.getUserId());
        UserMessage userMessage = new UserMessage();
        userMessage.setUser(user);
        userMessage.setAdmin(userMessageModel.isAdmin());
        userMessage.setText(userMessageModel.getText());
        userMessage.setRead(false);
        userMessage.setSendingTime(LocalDateTime.now());
        userMessageService.save(userMessage);
        return ResponseEntity.ok("Message saved successfully");
    }


    @PostMapping(path = "/update", consumes = "application/json", produces = "application/json")
    public ResponseEntity<?> updateUserMessage(@RequestBody List<Long> list) {
        log.info("Size: {}" , list.size());
        list.forEach(id -> {
            try {
                UserMessage userMessage = userMessageService.findById(id);
                userMessage.setRead(true);
                userMessageService.update(userMessage);
            } catch (Exception ex){
                log.warn("Exception.", ex);
            }
        });

        return ResponseEntity.ok("Message saved successfully");
    }

    @PostMapping(path = "/delete", consumes = "application/json", produces = "application/json")
    public ResponseEntity<?> updateUserMessage(@RequestBody UserMessageModel userMessageModel) {
            try {
                UserMessage userMessage = userMessageService.findById(userMessageModel.getId());
                userMessageService.delete(userMessage);
                return ResponseEntity.ok("Message delete successfully");
            } catch (Exception ex){
                log.warn("Exception.", ex);
            }
        return ResponseEntity.badRequest().body("Bad delete message");
    }

    @PostMapping(path = "/get/by/user", consumes = "application/json", produces = "application/json")
    public ResponseEntity<?> updateUserMessage(@RequestBody UserModel userModel) {
        try {
            User user = userService.findById(userModel.getId());
            List<UserMessage> allByUser = userMessageService.findAllByUser(user);

            return ResponseEntity.ok(allByUser);
        } catch (Exception ex){
            log.warn("Exception.", ex);
        }
        return ResponseEntity.badRequest().body("Bad get messages by user");
    }


}
