package devtov.calypsoapp.controller;

import devtov.calypsoapp.dto.TransactionModel;
import devtov.calypsoapp.entity.*;
import devtov.calypsoapp.payload.request.LoginRequest;
import devtov.calypsoapp.service.repository.*;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Objects;

@RestController
@RequestMapping("/trans")
@AllArgsConstructor
@Slf4j
@CrossOrigin
public class TransactionController {

    private final UserService userService;
    private final WalletTransactionService walletTransactionService;
    private final WalletAddressService walletAddressService;
    private final WalletTransactionStatusService walletTransactionStatusService;
    private final WalletTransactionTypeService walletTransactionTypeService;


    @PostMapping(value = "/save", consumes = "application/json", produces = "application/json")
    public ResponseEntity<?> authenticateUser(@RequestBody TransactionModel transactionModel) {

        User user = userService.findById(transactionModel.getUserId());
        WalletAddress walletAddress = walletAddressService.findById(transactionModel.getWalletAddressId());

        WalletTransactionStatus walletTransactionStatus = walletTransactionStatusService.findByStatus(transactionModel.getStatus());
        WalletTransactionType walletTransactionType = walletTransactionTypeService.findByType(transactionModel.getType());


        WalletTransaction walletTransaction = new WalletTransaction();
        walletTransaction.setHash(transactionModel.getHash());
        walletTransaction.setReceiveHash(transactionModel.getReceiveHash());
        walletTransaction.setStatus(walletTransactionStatus);
        walletTransaction.setMemo(transactionModel.getMemo());
        walletTransaction.setReceiveAddress(transactionModel.getReceiveAddress());
        walletTransaction.setType(walletTransactionType);
        walletTransaction.setHidden(transactionModel.isHidden());
        walletTransaction.setDateCreated(LocalDateTime.now());
        walletTransaction.setAmount(new BigDecimal(transactionModel.getAmount()));
        walletTransaction.setUser(user);
        walletTransaction.setWalletAddress(walletAddress);

        walletTransactionService.save(walletTransaction);
        return ResponseEntity.ok().body("Transaction saved successfully");
    }

    @PostMapping(value = "/update", consumes = "application/json", produces = "application/json")
    public ResponseEntity<?> transactionUpdate(@RequestBody TransactionModel transactionModel) {

        WalletTransaction transaction = walletTransactionService.findByHash(transactionModel.getHash());


        if (!transactionModel.getReceiveHash().equals(transaction.getReceiveHash())) {
            if (!transactionModel.getReceiveHash().isEmpty()) {
                int size = walletTransactionService.findAllByReceiveHash(transactionModel.getReceiveHash()).size();
                if (size > 0) {
                    WalletTransactionStatus byStatus = walletTransactionStatusService.findByStatus("error");
                    transaction.setStatus(byStatus);
                }
            }
        }

        transaction.setReceiveHash(transactionModel.getReceiveHash());
        transaction.setHidden(transactionModel.isHidden());
        walletTransactionService.save(transaction);


        return ResponseEntity.ok().body("Transaction saved successfully");
    }

    @PostMapping(value = "/get", consumes = "application/json", produces = "application/json")
    public ResponseEntity<?> transactionGet(@RequestBody TransactionModel transactionModel) {

        WalletTransaction byHash = walletTransactionService.findByHash(transactionModel.getHash());
        WalletTransactionStatus status = byHash.getStatus();

        return ResponseEntity.ok().body(status);
    }


}
