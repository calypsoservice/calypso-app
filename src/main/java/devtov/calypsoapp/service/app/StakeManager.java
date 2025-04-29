package devtov.calypsoapp.service.app;

import devtov.calypsoapp.dto.StakeModel;
import devtov.calypsoapp.entity.*;
import devtov.calypsoapp.service.repository.*;
import devtov.calypsoapp.service.web3.TransactionWEB3Manager;
import devtov.calypsoapp.service.web3.WalletManager;
import devtov.calypsoapp.util.RandomizerUtils;
import jakarta.annotation.PostConstruct;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.TimeUnit;

import static java.time.temporal.ChronoUnit.DAYS;

@Service
@AllArgsConstructor
@Slf4j
public class StakeManager {

    private final UserService userService;
    private final TokenService tokenService;
    private final StakeService stakeService;
    private final UserStakeService userStakeService;
    private final TransactionWEB3Manager transactionWEB3Manager;
    private final BigDecimal ONE_HUNDRED = new BigDecimal("100");
    private final WalletManager walletManager;
    private final WalletAddressService walletAddressService;
    private final WalletTransactionService walletTransactionService;
    private final WalletTransactionStatusService walletTransactionStatusService;
    private final WalletTransactionTypeService walletTransactionTypeService;
    private final RandomizerUtils randomizerUtils;


    public boolean stake(StakeModel stakeModel) {

        try {
            long stakeId = stakeModel.getStakeId();
            long tokenId = stakeModel.getTokenId();
            long userId = stakeModel.getUserId();


            User user = userService.findById(userId);
            Token token = tokenService.findById(tokenId);
            Stake stake = stakeService.findById(stakeId);


            UserStake userStake = new UserStake();
            userStake.setUser(user);
            userStake.setStake(stake);
            userStake.setToken(token);
            userStake.setAmount(stakeModel.getAmount());


            String transactionHash = randomizerUtils.generateTransactionHash();

            WalletTransactionStatus transactionCompleted = walletTransactionStatusService.findByStatus("completed");
            WalletTransactionType transactionStake = walletTransactionTypeService.findByType("stake");

            WalletAddress walletAddress = getWalletAddress(user, token);

            BigDecimal newBalance = walletAddress.getBalance().subtract(stakeModel.getAmount());

            walletAddress.setBalance(newBalance);
            walletAddressService.update(walletAddress);

            WalletTransaction walletTransaction = new WalletTransaction();
            walletTransaction.setHash(transactionHash);
            walletTransaction.setDateCreated(LocalDateTime.now());
            walletTransaction.setUser(user);
            walletTransaction.setWalletAddress(walletAddress);
            walletTransaction.setStatus(transactionCompleted);
            walletTransaction.setType(transactionStake);
            walletTransaction.setAmount(stakeModel.getAmount());
            walletTransaction.setUserStake(userStake);


            userStakeService.save(userStake);
            walletTransactionService.save(walletTransaction);


            return true;

        } catch (Exception ex) {
            log.warn("Exception transaction.", ex);
        }
        return false;
    }


    public void updateStakeData(UserStake userStake) {

        User user = userStake.getUser();
        Stake stake = userStake.getStake();
        Token token = userStake.getToken();
        BigDecimal amount = userStake.getAmount();
        LocalDateTime dateCreated = userStake.getDateCreated();


        log.info("Amount: {}", amount);
        int periodDays = stake.getPeriodDays();
        log.info("Period days: {}", periodDays);

        double percentDay = stake.getPercentDay();
        log.info("Percentage day: {}", percentDay);

        LocalDateTime dateNow = LocalDateTime.now();
        log.info("Date now: {}", dateNow);

        LocalDateTime dateFinish = dateCreated.plusDays(periodDays);
        log.info("Date finish: {}", dateFinish);

        long between = DAYS.between(dateCreated, dateNow);

        long betweenLastReward = DAYS.between(userStake.getDateLastReward(), dateNow);

        log.info("Between: {}", between);

        log.info("Spant period days: {}", dateFinish.isBefore(dateNow));
        BigDecimal dayReward = percentOf(new BigDecimal(percentDay), amount);


        if (stake.getName().equals("Largo 1") || stake.getName().equals("Largo 2")) {

            if (between < periodDays) {
                BigDecimal currentReward = dayReward.multiply(new BigDecimal(between).setScale(8, RoundingMode.HALF_UP));
                BigDecimal periodReward = dayReward.multiply(new BigDecimal(periodDays).setScale(8, RoundingMode.HALF_UP));
                log.info("Currency reward: {}", currentReward);
                log.info("Period reward: {}", periodReward);
                userStake.setCurrentReward(currentReward);
                userStake.setPeriodReward(periodReward);
            } else {
                BigDecimal currentReward = dayReward.multiply(new BigDecimal(periodDays).setScale(8, RoundingMode.HALF_UP));
                BigDecimal periodReward = dayReward.multiply(new BigDecimal(periodDays).setScale(8, RoundingMode.HALF_UP));
                log.info("Currency reward: {}", currentReward);
                log.info("Period reward: {}", periodReward);
                userStake.setCurrentReward(currentReward);
                userStake.setPeriodReward(periodReward);
                userStake.setClosed(true);


                BigDecimal amountStake = userStake.getAmount();
                BigDecimal fullAmount = userStake.getPeriodReward().add(amountStake);


                WalletTransactionStatus transactionCompleted = walletTransactionStatusService.findByStatus("completed");
                WalletTransactionType transactionStake = walletTransactionTypeService.findByType("unstake");
                WalletTransactionType transactionParentType = walletTransactionTypeService.findByType("refBonus");


                WalletAddress walletAddress = getWalletAddress(user, token);

                BigDecimal balance = walletAddress.getBalance();
                BigDecimal newBalance = balance.add(fullAmount);
                walletAddress.setBalance(newBalance);
                walletAddress.setBalance(newBalance);

                String hash = randomizerUtils.generateTransactionHash();
                WalletTransaction walletTransaction = new WalletTransaction();
                walletTransaction.setHash(hash);
                walletTransaction.setDateCreated(LocalDateTime.now());
                walletTransaction.setUser(user);
                walletTransaction.setWalletAddress(walletAddress);
                walletTransaction.setStatus(transactionCompleted);
                walletTransaction.setType(transactionStake);
                walletTransaction.setAmount(fullAmount);
                walletTransaction.setUserStake(userStake);
                walletTransactionService.save(walletTransaction);


            }
        } else {

            log.info("betweenLastReward: {}", betweenLastReward);

            if (between < periodDays) {

                BigDecimal currentReward = dayReward.multiply(new BigDecimal(between).setScale(8, RoundingMode.HALF_UP));
                BigDecimal periodReward = dayReward.multiply(new BigDecimal(periodDays).setScale(8, RoundingMode.HALF_UP));
                log.info("Currency reward: {}", currentReward);
                log.info("Period reward: {}", periodReward);
                userStake.setCurrentReward(currentReward);
                userStake.setPeriodReward(periodReward);


                if (betweenLastReward > 0) {
                    BigDecimal revRes = dayReward.multiply(new BigDecimal(betweenLastReward));


                    WalletAddress walletAddress = getWalletAddress(user, token);
                    BigDecimal newBalance = walletAddress.getBalance().add(revRes);
                    walletAddress.setBalance(newBalance);
                    walletAddressService.update(walletAddress);
                    userStake.setDateLastReward(LocalDateTime.now());


                    WalletTransactionStatus transactionCompleted = walletTransactionStatusService.findByStatus("completed");
                    WalletTransactionType transactionStake = walletTransactionTypeService.findByType("bonus");

                    String hash = randomizerUtils.generateTransactionHash();
                    WalletTransaction walletTransaction = new WalletTransaction();
                    walletTransaction.setHash(hash);
                    walletTransaction.setDateCreated(LocalDateTime.now());
                    walletTransaction.setUser(user);
                    walletTransaction.setWalletAddress(walletAddress);
                    walletTransaction.setStatus(transactionCompleted);
                    walletTransaction.setType(transactionStake);
                    walletTransaction.setAmount(revRes);
                    walletTransaction.setUserStake(userStake);
                    walletTransactionService.save(walletTransaction);

                }


            } else {
                BigDecimal currentReward = dayReward.multiply(new BigDecimal(periodDays).setScale(8, RoundingMode.HALF_UP));
                BigDecimal periodReward = dayReward.multiply(new BigDecimal(periodDays).setScale(8, RoundingMode.HALF_UP));
                log.info("Currency reward: {}", currentReward);
                log.info("Period reward: {}", periodReward);
                userStake.setCurrentReward(currentReward);
                userStake.setPeriodReward(periodReward);
                userStake.setClosed(true);


                WalletAddress walletAddress = getWalletAddress(user, token);
                walletAddress.setBalance(walletAddress.getBalance().add(dayReward));
                walletAddressService.update(walletAddress);

                WalletTransactionStatus transactionCompleted = walletTransactionStatusService.findByStatus("completed");
                WalletTransactionType transactionStake = walletTransactionTypeService.findByType("unstake");
                WalletTransactionType transactionParentType = walletTransactionTypeService.findByType("refBonus");
                WalletTransactionType transactionBonus = walletTransactionTypeService.findByType("bonus");


                String hashBonus = randomizerUtils.generateTransactionHash();
                WalletTransaction walletTransactionBonus = new WalletTransaction();
                walletTransactionBonus.setHash(hashBonus);
                walletTransactionBonus.setDateCreated(LocalDateTime.now());
                walletTransactionBonus.setUser(user);
                walletTransactionBonus.setWalletAddress(walletAddress);
                walletTransactionBonus.setStatus(transactionCompleted);
                walletTransactionBonus.setType(transactionBonus);
                walletTransactionBonus.setAmount(dayReward);
                walletTransactionBonus.setUserStake(userStake);
                walletTransactionService.save(walletTransactionBonus);


                BigDecimal balance = walletAddress.getBalance();
                BigDecimal newBalance = balance.add(amount);
                walletAddress.setBalance(newBalance);


                String hash = randomizerUtils.generateTransactionHash();
                WalletTransaction walletTransaction = new WalletTransaction();
                walletTransaction.setHash(hash);
                walletTransaction.setDateCreated(LocalDateTime.now());
                walletTransaction.setUser(user);
                walletTransaction.setWalletAddress(walletAddress);
                walletTransaction.setStatus(transactionCompleted);
                walletTransaction.setType(transactionStake);
                walletTransaction.setAmount(amount);
                walletTransaction.setUserStake(userStake);
                walletTransactionService.save(walletTransaction);
                walletAddressService.update(walletAddress);


            }
        }


        userStakeService.update(userStake);

    }


    @PostConstruct
    public void updateAllUserStake() {
        new Thread(() -> {
            while (true) {

                try {
                    userStakeService.findAll()
                            .stream()
                            .filter(s -> !s.isClosed())
                            .forEach(s -> {
                                try {
                                    updateStakeData(s);
                                } catch (Exception e) {
                                    log.warn("Exception", e);
                                }
                            });
                    TimeUnit.MINUTES.sleep(10);
                } catch (Exception ex) {
                    log.warn("Exception updateAllUserStake.", ex);
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

