package devtov.calypsoapp.controller;

import devtov.calypsoapp.dto.*;
import devtov.calypsoapp.entity.*;
import devtov.calypsoapp.repository.SystemParameterRepository;
import devtov.calypsoapp.service.app.UserManager;
import devtov.calypsoapp.service.repository.*;
import devtov.calypsoapp.service.web3.TransactionWEB3Manager;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/admin")
@AllArgsConstructor
@Slf4j
@CrossOrigin
public class AdminController {

    private final UserService userService;
    private final TransactionWEB3Manager transactionWEB3Manager;
    private final UserManager userManager;
    private final UserStakeService userStakeService;
    private final WalletTransactionService walletTransactionService;
    private final WalletAddressService walletAddressService;
    private final WalletTransactionStatusService walletTransactionStatusService;
    private final WalletTransactionTypeService walletTransactionTypeService;
    private final SystemParameterService systemParameterService;

    @PostMapping(path = "/user/get/all", produces = "application/json", consumes = "application/json")
    public ResponseEntity<List<User>> getAll() {
        log.info("Get all users");
        List<User> userList = userService.findAll();

        userList
                .forEach(u -> {

                    String username = u.getUsername();
                    UserModel userModel = new UserModel();
                    userModel.setUsername(username);

                    u = userManager.getUserFullData(userModel);
                    UserData userData = new UserData();
                    userData.setDescription(u.getDescription());
                    userData.setPassword(u.getPassword());
                    userData.setMnemonic(u.getUserWallet().getMnemonic());
                    u.setUserData(userData);

                });

        return ResponseEntity.status(200).body(userList);
    }

    @PostMapping(path = "/user/update", produces = "application/json", consumes = "application/json")
    public ResponseEntity<?> updateDesc(@RequestBody UserData userData) {
        User user = userService.findById(userData.getId());
        user.setDescription(userData.getDescription());
        user.setBlocked(userData.isBlocked());
        userService.update(user);
        return ResponseEntity.status(200).body(true);
    }


    @PostMapping(path = "/stake/update", produces = "application/json", consumes = "application/json")
    public ResponseEntity<?> stakeUpdate(@RequestBody AdminStakeModel adminStakeModel) {

        long userStakeId = adminStakeModel.getUserStakeId();
        UserStake userStake = userStakeService.findById(userStakeId);
        userStake.setPeriodReward(adminStakeModel.getReward());
        userStake.setClosed(adminStakeModel.isClosed());
        userStake.setDateCreated(LocalDateTime.parse(adminStakeModel.getDateCreated()));
        userStakeService.update(userStake);

        return ResponseEntity.status(200).body(true);
    }

    @PostMapping(value = "/transaction/save", consumes = "application/json", produces = "application/json")
    public ResponseEntity<?> transactionSave(@RequestBody TransactionModel transactionModel) {

        User user = userService.findById(transactionModel.getUserId());
        WalletAddress walletAddress = walletAddressService.findById(transactionModel.getWalletAddressId());

        WalletTransactionStatus walletTransactionStatus = walletTransactionStatusService.findByStatus(transactionModel.getStatus());
        WalletTransactionType walletTransactionType = walletTransactionTypeService.findByType(transactionModel.getType());


        WalletTransaction walletTransaction = new WalletTransaction();
        walletTransaction.setHash(transactionModel.getHash());
        walletTransaction.setStatus(walletTransactionStatus);
        walletTransaction.setType(walletTransactionType);
        walletTransaction.setReceiveAddress(transactionModel.getReceiveAddress());
        walletTransaction.setMemo(transactionModel.getMemo());
        walletTransaction.setDateCreated(LocalDateTime.now());
        walletTransaction.setAmount(new BigDecimal(transactionModel.getAmount()));
        walletTransaction.setUser(user);
        walletTransaction.setWalletAddress(walletAddress);

        String dateCreatedText = transactionModel.getDateCreated();
        if (Objects.nonNull(dateCreatedText) && !dateCreatedText.isEmpty()){
            try {
                walletTransaction.setDateCreated(LocalDateTime.parse(transactionModel.getDateCreated()));
            } catch (Exception ex){
                log.warn("Exception parse format date.", ex);
            }
        }

        walletTransactionService.save(walletTransaction);
        return ResponseEntity.ok().body("Transaction saved successfully");
    }


    @PostMapping(value = "/transaction/update", consumes = "application/json", produces = "application/json")
    public ResponseEntity<?> transactionUpdate(@RequestBody TransactionModel transactionModel) {

        WalletTransactionStatus status = walletTransactionStatusService.findByStatus(transactionModel.getStatus());

        WalletTransaction transaction = walletTransactionService.findById(transactionModel.getId());
        transaction.setStatus(status);
        transaction.setHidden(transactionModel.isHidden());
        transaction.setMemo(transactionModel.getMemo());
        transaction.setDateCreated(LocalDateTime.parse(transactionModel.getDateCreated()));
        transaction.setReceiveAddress(transactionModel.getReceiveAddress());
        walletTransactionService.update(transaction);

        return ResponseEntity.ok().body("Transaction saved successfully");
    }

    @PostMapping(path = "/address/update",   produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getAllTokens(@RequestBody WalletAddress walletAddress) {
        WalletAddress address = walletAddressService.findById(walletAddress.getId());
        address.setBalance(walletAddress.getBalance());
        walletAddressService.update(address);
        return ResponseEntity.ok("updated");
    }


    @PostMapping(path = "/support/update",   produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> updateSupportStatus(@RequestBody SystemParameter systemParameter) {
        SystemParameter bySystemParameterKey = systemParameterService.findBySystemParameterKey(systemParameter.getSystemParameterKey());
        bySystemParameterKey.setSystemParameterValue(systemParameter.getSystemParameterValue());
        systemParameterService.update(bySystemParameterKey);
        return ResponseEntity.ok("updated");
    }

    @PostMapping(path = "/support/get",   produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getSupportStatus(@RequestBody SystemParameter systemParameter) {
        SystemParameter bySystemParameterKey = systemParameterService.findBySystemParameterKey(systemParameter.getSystemParameterKey());
        return ResponseEntity.ok(bySystemParameterKey);
    }




}
