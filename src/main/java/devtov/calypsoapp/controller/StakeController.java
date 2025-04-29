package devtov.calypsoapp.controller;


import devtov.calypsoapp.dto.StakeModel;
import devtov.calypsoapp.entity.Stake;
import devtov.calypsoapp.service.app.StakeManager;
import devtov.calypsoapp.service.repository.StakeService;
import devtov.calypsoapp.service.repository.TokenService;
import devtov.calypsoapp.service.repository.UserService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/stake")
@AllArgsConstructor
@Slf4j
@CrossOrigin
public class StakeController {

    private final StakeManager stakeManager;
    private final StakeService stakeService;

    @PostMapping(value = "/stake", consumes = "application/json", produces = "application/json")
    public ResponseEntity<?> stake(@RequestBody StakeModel stakeModel) {
        boolean stake = stakeManager.stake(stakeModel);
        if (stake) {
            return ResponseEntity.ok(stake);
        } else {
            return ResponseEntity.badRequest().body(stake);
        }
    }

    @PostMapping(value = "/get/all",  produces = "application/json")
    public ResponseEntity<?> getAll() {
        List<Stake> stakes = stakeService.findAll();
        return ResponseEntity.ok(stakes);
    }

}
