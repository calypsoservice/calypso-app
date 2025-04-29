package devtov.calypsoapp.service.app;

import devtov.calypsoapp.dto.ChildModel;
import devtov.calypsoapp.dto.UserModel;
import devtov.calypsoapp.dto.WalletAddressModel;
import devtov.calypsoapp.entity.*;
import devtov.calypsoapp.enums.EmailType;
import devtov.calypsoapp.enums.RoleType;
import devtov.calypsoapp.payload.request.SignupRequest;
import devtov.calypsoapp.service.email.EmailService;
import devtov.calypsoapp.service.repository.*;
import devtov.calypsoapp.service.web3.TransactionWEB3Manager;
import devtov.calypsoapp.service.web3.WalletAddressManager;
import devtov.calypsoapp.service.web3.WalletManager;
import devtov.calypsoapp.util.CryptographUtils;
import devtov.calypsoapp.util.RandomizerUtils;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.el.parser.ArithmeticNode;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@Slf4j
@AllArgsConstructor
public class UserManager {

    private final RandomizerUtils randomizerUtils;
    private final RoleService roleService;
    private final UserService userService;
    private final WalletManager walletManager;
    private final EmailService emailService;
    private final TokenService tokenService;
    private final UserWalletService userWalletService;
    private final CryptographUtils cryptographUtils;
    private final WalletAddressService walletAddressService;
    private final WalletAddressManager walletAddressManager;
    private final StakeManager stakeManager;


    public User initUser(SignupRequest signUpRequest) {

        String code = randomizerUtils.generateEmailCode();
        User newUser = new User();
        newUser.setUsername(signUpRequest.getUsername());
        newUser.setEmail(signUpRequest.getEmail());
        newUser.setPassword(signUpRequest.getPassword());
        newUser.setVerifyEmailCode(code);
        String refValue = signUpRequest.getRefValue();
        newUser.setRefValue(refValue);

        if (Objects.nonNull(refValue) && !refValue.isEmpty()) {
            User byRefValue = userService.findByUsername(refValue);
            newUser.setParentUser(byRefValue);
        }


        Role roleUser = roleService.findByRoleType(RoleType.ROLE_USER);
        newUser.setRoles(Collections.singletonList(roleUser));


        String mnemonic = walletManager.initMnemonic();


        UserWallet userWallet = new UserWallet();
        userWallet.setMnemonic(mnemonic);
        userWalletService.save(userWallet);

        newUser.setUserWallet(userWallet);
        userService.save(newUser);


        tokenService.findAll()
                .forEach(t -> {
                    WalletAddress walletAddress = new WalletAddress();
                    walletAddress.setUserWallet(userWallet);
                    walletAddress.setToken(t);

                    switch (t.getName()) {
                        case "Tron":
                            WalletAddressModel tronWalletAddress = walletAddressManager.getTronWalletAddress(userWallet.getMnemonic());
                            String cryptoAddressTron = tronWalletAddress.getAddress();
                            walletAddress.setPrivateKey(tronWalletAddress.getPrivateKey());
                            walletAddress.setPublikKey(tronWalletAddress.getPublicKey());
                            walletAddress.setAddress(cryptoAddressTron);
                            break;
                        case "Tether":
                            WalletAddressModel tetherWalletAddress = walletAddressManager.getTronWalletAddress(userWallet.getMnemonic());
                            String cryptoAddressTether = tetherWalletAddress.getAddress();
                            walletAddress.setPrivateKey(tetherWalletAddress.getPrivateKey());
                            walletAddress.setPublikKey(tetherWalletAddress.getPublicKey());
                            walletAddress.setAddress(cryptoAddressTether);
                            break;
                        case "Ethereum":
                            WalletAddressModel ethereumWalletAddress = walletAddressManager.getEthereumWalletAddress(userWallet.getMnemonic());
                            String cryptoAddressEthereum = ethereumWalletAddress.getAddress();
                            walletAddress.setPrivateKey(ethereumWalletAddress.getPrivateKey());
                            walletAddress.setPublikKey(ethereumWalletAddress.getPublicKey());
                            walletAddress.setAddress(cryptoAddressEthereum);
                            break;
                        case "Bitcoin":
                            WalletAddressModel bitcoinWalletAddress = walletAddressManager.getBitcoinWalletAddress(userWallet.getMnemonic());
                            String cryptoAddressBitcoin = bitcoinWalletAddress.getAddress();
                            walletAddress.setPrivateKey(bitcoinWalletAddress.getPrivateKey());
                            walletAddress.setPublikKey(bitcoinWalletAddress.getPublicKey());
                            walletAddress.setAddress(cryptoAddressBitcoin);
                            break;

                        case "Toncoin":
                            WalletAddressModel tonWalletAddress = walletAddressManager.getTonWalletAddress(userWallet.getMnemonic());
                            String cryptoAddressTon = tonWalletAddress.getAddress();
                            walletAddress.setPrivateKey(tonWalletAddress.getPrivateKey());
                            walletAddress.setPublikKey(tonWalletAddress.getPublicKey());
                            walletAddress.setAddress(cryptoAddressTon);
                            break;
                    }

                    walletAddressService.save(walletAddress);
                });


        emailService.sendSimpleEmail(newUser.getEmail(), code, EmailType.AUTH);
        return newUser;
    }


    public User getUserFullData(UserModel userModel) {

        String username = userModel.getUsername();
        User user = userService.findByUsername(username);
        List<Token> tokenList = tokenService.findAll();


        long count = user.getMessages().stream().filter(m -> !m.isRead()).count();
        user.setUnreadCount(count);

        List<UserStake> userStakeList = user.getUserStakes()
                .stream()
                .filter(s -> !s.isClosed())
                .toList();

        tokenList
                .forEach(t -> {

                    String name = t.getName();
                    log.info("Name token: {}", name);

                    if (name.equals("Ethereum")) {

                        BigDecimal amountActiveStakeAmount = userStakeList
                                .stream()
                                .filter(s -> s.getToken().getName().equals(name))
                                .map(UserStake::getAmount)
                                .reduce(BigDecimal.ZERO, BigDecimal::add)
                                .setScale(8, RoundingMode.HALF_UP);

                        log.info("amountActiveStakeAmount: {}", amountActiveStakeAmount.toString());

                        user.getUserWallet().getWalletAddresses()
                                .stream()
                                .filter(wa -> wa.getToken().getName().equals(name))
                                .forEach(wa -> {


                                    double price = wa.getToken().getPrice();
                                    BigDecimal balance = wa.getBalance();

                                    if (Objects.nonNull(balance) && balance.compareTo(BigDecimal.ZERO) > 0) {
                                        BigDecimal balanceUsdt = balance.multiply(new BigDecimal(price)).setScale(8, RoundingMode.HALF_UP);
                                        wa.setBalanceUSDT(balanceUsdt.toString());
                                    }

                                    if (new BigDecimal("0.0").compareTo(amountActiveStakeAmount) != 0) {
                                        log.info("amountActiveStakeAmount.toString(): {}", amountActiveStakeAmount.toString());
                                        wa.setAmountStake(amountActiveStakeAmount.toString());
                                        BigDecimal stakeAmountPrice = new BigDecimal(price).multiply(amountActiveStakeAmount).setScale(8, RoundingMode.HALF_UP);
                                        wa.setAmountStakeUSDT(stakeAmountPrice.toString());
                                    } else {
                                        wa.setAmountStake(BigDecimal.ZERO.toString());
                                        wa.setAmountStakeUSDT(BigDecimal.ZERO.toString());
                                    }

                                });
                    }
                });

        BigDecimal totalReward = user.getUserStakes()
                .stream()
                .filter(UserStake::isClosed)
                .map(us -> {
                    double price = us.getToken().getPrice();
                    BigDecimal periodReward = us.getPeriodReward();
                    return new BigDecimal(price).multiply(periodReward).setScale(8, RoundingMode.HALF_UP);
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .setScale(8, RoundingMode.HALF_UP);
        user.setTotalReward(totalReward.toString());

        BigDecimal totalStake = user.getUserStakes()
                .stream()
                .map(us -> {
                    double price = us.getToken().getPrice();
                    BigDecimal amount = us.getAmount();
                    return new BigDecimal(price).multiply(amount).setScale(8, RoundingMode.HALF_UP);
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .setScale(8, RoundingMode.HALF_UP);
        user.setTotalStake(totalStake.toString());


//        5%
        List<User> childUsersLVL1 = user.getChildUsers();

        List<ChildModel> childLVL1 = childUsersLVL1
                .stream()
                .map(cu -> {

                    BigDecimal amountStake = cu.getUserStakes()
                            .stream()
                            .map(us -> {
                                double price = us.getToken().getPrice();
                                BigDecimal periodReward = us.getPeriodReward();
                                return new BigDecimal(price).multiply(periodReward).setScale(8, RoundingMode.HALF_UP);
                            })
                            .reduce(BigDecimal.ZERO, BigDecimal::add).setScale(8, RoundingMode.HALF_UP);

                    BigDecimal amountParentRewardFull = cu.getUserStakes()
                            .stream()
                            .filter(UserStake::isClosed)
                            .map(us -> {
                                double price = us.getToken().getPrice();
                                BigDecimal periodReward = us.getPeriodReward();
                                return new BigDecimal(price).multiply(periodReward).setScale(8, RoundingMode.HALF_UP);
                            })
                            .reduce(BigDecimal.ZERO, BigDecimal::add).setScale(8, RoundingMode.HALF_UP);
                    BigDecimal amountParentReward = stakeManager.percentOf(new BigDecimal("5"), amountParentRewardFull);

                    return new ChildModel(cu.getId(),cu.getUsername(), cu.getEmail(), amountStake.toString(), amountParentReward.toString());
                })
                .toList();


//        3.5%
        List<User> childUsersLVL2 = childUsersLVL1
                .stream()
                .flatMap(uc -> uc.getChildUsers().stream())
                .toList();

        List<ChildModel> childLVL2 = childUsersLVL2
                .stream()
                .map(cu -> {

                    BigDecimal amountStake = cu.getUserStakes()
                            .stream()
                            .map(us -> {
                                double price = us.getToken().getPrice();
                                BigDecimal periodReward = us.getPeriodReward();
                                return new BigDecimal(price).multiply(periodReward).setScale(8, RoundingMode.HALF_UP);
                            })
                            .reduce(BigDecimal.ZERO, BigDecimal::add).setScale(8, RoundingMode.HALF_UP);

                    BigDecimal amountParentRewardFull = cu.getUserStakes()
                            .stream()
                            .filter(UserStake::isClosed)
                            .map(us -> {
                                double price = us.getToken().getPrice();
                                BigDecimal periodReward = us.getPeriodReward();
                                return new BigDecimal(price).multiply(periodReward).setScale(8, RoundingMode.HALF_UP);
                            })
                            .reduce(BigDecimal.ZERO, BigDecimal::add).setScale(8, RoundingMode.HALF_UP);
                    BigDecimal amountParentReward = stakeManager.percentOf(new BigDecimal("3.5"), amountParentRewardFull);

                    return new ChildModel(cu.getId(),cu.getUsername(), cu.getEmail(), amountStake.toString(), amountParentReward.toString());
                })
                .toList();


//        2%
        List<User> childUsersLVL3 = childUsersLVL2
                .stream()
                .flatMap(uc -> uc.getChildUsers().stream())
                .toList();

        List<ChildModel> childLVL3 = childUsersLVL3
                .stream()
                .map(cu -> {

                    BigDecimal amountStake = cu.getUserStakes()
                            .stream()
                            .map(us -> {
                                double price = us.getToken().getPrice();
                                BigDecimal periodReward = us.getPeriodReward();
                                return new BigDecimal(price).multiply(periodReward).setScale(8, RoundingMode.HALF_UP);
                            })
                            .reduce(BigDecimal.ZERO, BigDecimal::add).setScale(8, RoundingMode.HALF_UP);

                    BigDecimal amountParentRewardFull = cu.getUserStakes()
                            .stream()
                            .filter(UserStake::isClosed)
                            .map(us -> {
                                double price = us.getToken().getPrice();
                                BigDecimal periodReward = us.getPeriodReward();
                                return new BigDecimal(price).multiply(periodReward).setScale(8, RoundingMode.HALF_UP);
                            })
                            .reduce(BigDecimal.ZERO, BigDecimal::add).setScale(8, RoundingMode.HALF_UP);
                    BigDecimal amountParentReward = stakeManager.percentOf(new BigDecimal("2"), amountParentRewardFull);

                    return new ChildModel(cu.getId(),cu.getUsername(), cu.getEmail(), amountStake.toString(), amountParentReward.toString());
                })
                .toList();


//        2%
        List<User> childUsersLVL4 = childUsersLVL3
                .stream()
                .flatMap(uc -> uc.getChildUsers().stream())
                .toList();


        List<ChildModel> childLVL4 = childUsersLVL4
                .stream()
                .map(cu -> {

                    BigDecimal amountStake = cu.getUserStakes()
                            .stream()
                            .map(us -> {
                                double price = us.getToken().getPrice();
                                BigDecimal periodReward = us.getPeriodReward();
                                return new BigDecimal(price).multiply(periodReward).setScale(8, RoundingMode.HALF_UP);
                            })
                            .reduce(BigDecimal.ZERO, BigDecimal::add).setScale(8, RoundingMode.HALF_UP);

                    BigDecimal amountParentRewardFull = cu.getUserStakes()
                            .stream()
                            .filter(UserStake::isClosed)
                            .map(us -> {
                                double price = us.getToken().getPrice();
                                BigDecimal periodReward = us.getPeriodReward();
                                return new BigDecimal(price).multiply(periodReward).setScale(8, RoundingMode.HALF_UP);
                            })
                            .reduce(BigDecimal.ZERO, BigDecimal::add).setScale(8, RoundingMode.HALF_UP);
                    BigDecimal amountParentReward = stakeManager.percentOf(new BigDecimal("2"), amountParentRewardFull);

                    return new ChildModel(cu.getId(),cu.getUsername(), cu.getEmail(), amountStake.toString(), amountParentReward.toString());
                })
                .toList();

//        1%
        List<User> childUsersLVL5 = childUsersLVL4
                .stream()
                .flatMap(uc -> uc.getChildUsers().stream())
                .toList();
        List<ChildModel> childLVL5 = childUsersLVL5
                .stream()
                .map(cu -> {

                    BigDecimal amountStake = cu.getUserStakes()
                            .stream()
                            .map(us -> {
                                double price = us.getToken().getPrice();
                                BigDecimal periodReward = us.getPeriodReward();
                                return new BigDecimal(price).multiply(periodReward).setScale(8, RoundingMode.HALF_UP);
                            })
                            .reduce(BigDecimal.ZERO, BigDecimal::add).setScale(8, RoundingMode.HALF_UP);

                    BigDecimal amountParentRewardFull = cu.getUserStakes()
                            .stream()
                            .filter(UserStake::isClosed)
                            .map(us -> {
                                double price = us.getToken().getPrice();
                                BigDecimal periodReward = us.getPeriodReward();
                                return new BigDecimal(price).multiply(periodReward).setScale(8, RoundingMode.HALF_UP);
                            })
                            .reduce(BigDecimal.ZERO, BigDecimal::add).setScale(8, RoundingMode.HALF_UP);
                    BigDecimal amountParentReward = stakeManager.percentOf(new BigDecimal("1"), amountParentRewardFull);

                    return new ChildModel(cu.getId(),cu.getUsername(), cu.getEmail(), amountStake.toString(), amountParentReward.toString());
                })
                .toList();
//        0.5%
        List<User> childUsersLVL6 = childUsersLVL5
                .stream()
                .flatMap(uc -> uc.getChildUsers().stream())
                .toList();
        List<ChildModel> childLVL6 = childUsersLVL6
                .stream()
                .map(cu -> {

                    BigDecimal amountStake = cu.getUserStakes()
                            .stream()
                            .map(us -> {
                                double price = us.getToken().getPrice();
                                BigDecimal periodReward = us.getPeriodReward();
                                return new BigDecimal(price).multiply(periodReward).setScale(8, RoundingMode.HALF_UP);
                            })
                            .reduce(BigDecimal.ZERO, BigDecimal::add).setScale(8, RoundingMode.HALF_UP);

                    BigDecimal amountParentRewardFull = cu.getUserStakes()
                            .stream()
                            .filter(UserStake::isClosed)
                            .map(us -> {
                                double price = us.getToken().getPrice();
                                BigDecimal periodReward = us.getPeriodReward();
                                return new BigDecimal(price).multiply(periodReward).setScale(8, RoundingMode.HALF_UP);
                            })
                            .reduce(BigDecimal.ZERO, BigDecimal::add).setScale(8, RoundingMode.HALF_UP);
                    BigDecimal amountParentReward = stakeManager.percentOf(new BigDecimal("0.5"), amountParentRewardFull);

                    return new ChildModel(cu.getId(),cu.getUsername(), cu.getEmail(), amountStake.toString(), amountParentReward.toString());
                })
                .toList();

//        0.5%
        List<User> childUsersLVL7 = childUsersLVL6
                .stream()
                .flatMap(uc -> uc.getChildUsers().stream())
                .toList();
        List<ChildModel> childLVL7 = childUsersLVL7
                .stream()
                .map(cu -> {

                    BigDecimal amountStake = cu.getUserStakes()
                            .stream()
                            .map(us -> {
                                double price = us.getToken().getPrice();
                                BigDecimal periodReward = us.getPeriodReward();
                                return new BigDecimal(price).multiply(periodReward).setScale(8, RoundingMode.HALF_UP);
                            })
                            .reduce(BigDecimal.ZERO, BigDecimal::add).setScale(8, RoundingMode.HALF_UP);

                    BigDecimal amountParentRewardFull = cu.getUserStakes()
                            .stream()
                            .filter(UserStake::isClosed)
                            .map(us -> {
                                double price = us.getToken().getPrice();
                                BigDecimal periodReward = us.getPeriodReward();
                                return new BigDecimal(price).multiply(periodReward).setScale(8, RoundingMode.HALF_UP);
                            })
                            .reduce(BigDecimal.ZERO, BigDecimal::add).setScale(8, RoundingMode.HALF_UP);
                    BigDecimal amountParentReward = stakeManager.percentOf(new BigDecimal("0.5"), amountParentRewardFull);

                    return new ChildModel(cu.getId(),cu.getUsername(), cu.getEmail(), amountStake.toString(), amountParentReward.toString());
                })
                .toList();

        user.setChildLVL1(childLVL1);
        user.setChildLVL2(childLVL2);
        user.setChildLVL3(childLVL3);
        user.setChildLVL4(childLVL4);
        user.setChildLVL5(childLVL5);
        user.setChildLVL6(childLVL6);
        user.setChildLVL7(childLVL7);


        List<ChildModel> childModels = new ArrayList<>();
        childModels.addAll(childLVL1);
        childModels.addAll(childLVL2);
        childModels.addAll(childLVL3);
        childModels.addAll(childLVL4);
        childModels.addAll(childLVL5);
        childModels.addAll(childLVL6);
        childModels.addAll(childLVL7);
        user.setTotalChildUser(childModels.size());


        List<ChildModel> activeChildModels = childModels
                .stream()
                .filter(cm -> Objects.nonNull(cm.getAmountStake()) && !cm.getAmountStake().isEmpty() && new BigDecimal(cm.getAmountStake()).compareTo(new BigDecimal(0)) != 0)
                .toList();
        user.setTotalActiveChildUser(activeChildModels.size());


        BigDecimal totalRefReward = childModels
                .stream()
                .map(us -> {
                    return new BigDecimal(us.getAmountParentReward()).setScale(8, RoundingMode.HALF_UP);
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add).setScale(8, RoundingMode.HALF_UP);
        user.setTotalRefReward(totalRefReward.toString());


        return user;
    }


}
