package devtov.calypsoapp.service.web3;

import devtov.calypsoapp.dto.BlockchainTransactionResult;
import devtov.calypsoapp.entity.*;
import devtov.calypsoapp.service.repository.WalletAddressService;
import devtov.calypsoapp.service.repository.WalletTransactionService;
import devtov.calypsoapp.service.repository.WalletTransactionStatusService;
import devtov.calypsoapp.service.repository.WalletTransactionTypeService;
import devtov.calypsoapp.util.RandomizerUtils;
import jakarta.annotation.PostConstruct;
import jakarta.persistence.PostRemove;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.TimeUnit;

import static java.time.temporal.ChronoUnit.MINUTES;

@Service
@Slf4j
@AllArgsConstructor
public class BlockChainManager {

    private final WalletTransactionService walletTransactionService;
    private final WalletTransactionTypeService walletTransactionTypeService;
    private final WalletTransactionStatusService walletTransactionStatusService;
    private final TransactionWEB3Manager transactionWEB3Manager;
    private final WalletAddressService walletAddressService;
    private final RandomizerUtils randomizerUtils;
    private final BigDecimal ONE_HUNDRED = new BigDecimal("100");

    @PostConstruct
    public void initTransactionList() {
        new Thread(() -> {

            while (true) {
                try {

                    WalletTransactionType type = walletTransactionTypeService.findByType("receive");
                    WalletTransactionStatus status = walletTransactionStatusService.findByStatus("prepared");

                    List<WalletTransaction> transactionReceiveList = walletTransactionService.findByTypeAndStatus(type, status)
                            .stream()
                            .filter(t -> Objects.nonNull(t.getReceiveHash()) && !t.getReceiveHash().isEmpty())
                            .toList();

                    transactionReceiveList.forEach(t -> {


                        BlockchainTransactionResult blockchainTransactionResult = transactionWEB3Manager.getTransactionData(t);

                        if (Objects.isNull(blockchainTransactionResult)) {
                            LocalDateTime dateCreated = t.getDateCreated();
                            LocalDateTime dateNow = LocalDateTime.now();

                            long between = MINUTES.between(dateCreated, dateNow);

                            if (between > 30) {
                                WalletTransactionStatus errorStatus = walletTransactionStatusService.findByStatus("error");
                                t.setStatus(errorStatus);
                                walletTransactionService.update(t);
                            }



                        } else {

                            boolean successful = blockchainTransactionResult.isSuccessful();
                            if (successful) {

                                int idx = blockchainTransactionResult.getAmount().compareTo(t.getAmount());
                                if (idx >= 0) {

                                    BigDecimal newAddressBalance = t.getWalletAddress().getBalance().add(blockchainTransactionResult.getAmount());
                                    WalletTransactionStatus completedStatus = walletTransactionStatusService.findByStatus("completed");
                                    t.setStatus(completedStatus);
                                    walletTransactionService.update(t);

                                    WalletAddress walletAddress = t.getWalletAddress();
                                    walletAddress.setBalance(newAddressBalance);
                                    walletAddressService.update(walletAddress);



                                    WalletTransactionStatus transactionCompleted = walletTransactionStatusService.findByStatus("completed");
                                    WalletTransactionType transactionStake = walletTransactionTypeService.findByType("unstake");
                                    WalletTransactionType transactionParentType = walletTransactionTypeService.findByType("refBonus");

                                    User parentUser = t.getUser().getParentUser();
                                    int idxParent = 1;
                                    double parentPercent = 0.0;

                                    while (idxParent <= 7) {

                                        if (Objects.nonNull(parentUser)) {

                                            if (idxParent == 1) {
                                                parentPercent = 5.0;
                                            } else if (idx == 2) {
                                                parentPercent = 3.5;
                                            } else if (idx == 3 || idxParent == 4) {
                                                parentPercent = 2;
                                            } else if (idx == 5) {
                                                parentPercent = 1;
                                            } else if (idx == 6 || idxParent == 7) {
                                                parentPercent = 0.5;
                                            }


                                            BigDecimal parentRewardResult = percentOf(new BigDecimal(parentPercent), blockchainTransactionResult.getAmount());

                                            WalletAddress walletAddressParent = getWalletAddress(parentUser, t.getWalletAddress().getToken());

                                            BigDecimal newParentBalance = walletAddressParent.getBalance().add(parentRewardResult);
                                            walletAddressParent.setBalance(newParentBalance);
                                            walletAddressService.update(walletAddressParent);

                                            String hashParent = randomizerUtils.generateTransactionHash();
                                            WalletTransaction walletTransactionParent = new WalletTransaction();
                                            walletTransactionParent.setHash(hashParent);
                                            walletTransactionParent.setDateCreated(LocalDateTime.now());
                                            walletTransactionParent.setUser(parentUser);
                                            walletTransactionParent.setWalletAddress(walletAddressParent);
                                            walletTransactionParent.setStatus(transactionCompleted);
                                            walletTransactionParent.setType(transactionParentType);
                                            walletTransactionParent.setAmount(parentRewardResult);
                                            walletTransactionService.save(walletTransactionParent);


                                        } else {
                                            return;
                                        }

                                        parentUser = parentUser.getParentUser();
                                        idxParent++;

                                    }


                                    transactionWEB3Manager.sendAddressDepositToSystemWallet(walletAddress);

                                } else {
                                    WalletTransactionStatus incorrectAmountStatus = walletTransactionStatusService.findByStatus("incorrect_amount");
                                    t.setStatus(incorrectAmountStatus);
                                    walletTransactionService.update(t);
                                }

                            }
                        }

                    });

                    try {
                        TimeUnit.MINUTES.sleep(1);
                    } catch (Exception ex) {
                        log.warn("Exception sleep.", ex);
                    }

                } catch (Exception ex) {
                    log.warn("Exception initTransactionList.", ex);
                }
            }
        }).start();
    }

    public BigDecimal percentOf(BigDecimal percentage, BigDecimal total) {
        return percentage.multiply(total).divide(ONE_HUNDRED, 8, RoundingMode.HALF_UP);
    }
    public WalletAddress getWalletAddress(User user, Token token) {
        WalletAddress walletAddress = null;

        try {
            walletAddress = user
                    .getUserWallet()
                    .getWalletAddresses()
                    .stream()
                    .filter(wa -> wa.getToken().getName().equals(token.getName()))
                    .findFirst()
                    .orElse(null);
        } catch (Exception ex) {
            log.warn("Exception getting wallet address.", ex);
        }

        return walletAddress;
    }

}
