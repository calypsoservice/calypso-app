package devtov.calypsoapp.controller;


import devtov.calypsoapp.entity.SystemParameter;
import devtov.calypsoapp.entity.User;
import devtov.calypsoapp.enums.EmailType;
import devtov.calypsoapp.payload.request.EmailCodeRequest;
import devtov.calypsoapp.payload.request.LoginRequest;
import devtov.calypsoapp.payload.request.RecoveryPasswordRequest;
import devtov.calypsoapp.payload.request.SignupRequest;
import devtov.calypsoapp.payload.response.JwtResponse;
import devtov.calypsoapp.payload.response.MessageResponse;
import devtov.calypsoapp.service.app.UserManager;
import devtov.calypsoapp.service.email.EmailService;
import devtov.calypsoapp.service.repository.RoleService;
import devtov.calypsoapp.service.repository.SystemParameterService;
import devtov.calypsoapp.service.repository.UserService;
import devtov.calypsoapp.service.web3.WalletManager;
import devtov.calypsoapp.util.JwtUtils;
import devtov.calypsoapp.util.RandomizerUtils;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/auth")
@AllArgsConstructor
@Slf4j
@CrossOrigin
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final RoleService roleService;
    private final JwtUtils jwtUtils;
    private final RandomizerUtils randomizerUtils;
    private final SystemParameterService systemParameterService;
    private final EmailService emailService;
    private final WalletManager walletManager;
    private final UserManager userManager;


    @PostMapping(value = "/signin", consumes = "application/json", produces = "application/json")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        log.info("sing in: {}", loginRequest);
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        User user = (User) authentication.getPrincipal();
        List<String> roles = user.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        return ResponseEntity.ok(new JwtResponse(user.getId(), user.getUsername(), user.getEmail(), jwt, "Bearer", user.isVerifyEmail(),roles));
    }


    @PostMapping(value = "/signup", consumes = "application/json", produces = "application/json")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest signUpRequest) {
        if (signUpRequest.getEmail().isEmpty() || signUpRequest.getUsername().isEmpty()) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Username or email is not valid!"));
        }

        if (Objects.nonNull(userService.findByUsername(signUpRequest.getUsername()))) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Username is already taken!"));
        }

        if (Objects.nonNull(userService.findByEmail(signUpRequest.getEmail()))) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Email is already in use!"));
        }

        User user = userManager.initUser(signUpRequest);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }


    @PostMapping(value = "/user/verify/status/update", consumes = "application/json", produces = "application/json")
    public ResponseEntity<?> verifyUser(@RequestBody EmailCodeRequest request) {
        log.info("verify update: {}", request.getEmail());
        User user = userService.findByEmail(request.getEmail());
        log.info("User {} is null: {}", request.getEmail(), Objects.isNull(user));
        if (Objects.nonNull(user)) {
            if (user.getVerifyEmailCode().equals(request.getEmailCode())) {
                user.setVerifyEmail(true);
                userService.update(user);
                return ResponseEntity.ok(new MessageResponse("verify successfully!"));
            } else {
                return ResponseEntity
                        .badRequest()
                        .body(new MessageResponse("Email code not valid!"));
            }

        } else {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Email code not found!"));

        }

    }

    @PostMapping(value = "/recovery/email/send", consumes = "application/json", produces = "application/json")
    public ResponseEntity<?> recoverySendCode(@RequestBody EmailCodeRequest request) {
        log.info("recovery send email code: {}", request.getEmail());

        User user = userService.findByEmail(request.getEmail());

        if (Objects.nonNull(user)) {
            String emailCode = randomizerUtils.generateEmailCode();
            user.setRecoveryCode(emailCode);
            user.setRecoveryRequestTime(LocalDateTime.now());
            userService.update(user);
            emailService.sendSimpleEmail(user.getEmail(), emailCode, EmailType.RECEIVE);

            return ResponseEntity.ok(new MessageResponse("Email code sent successfully!"));
        } else {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("User for recover not found!"));
        }
    }

    @PostMapping(value = "/recovery/password/check", consumes = "application/json", produces = "application/json")
    public ResponseEntity<?> recoveryPasswordCheck(@RequestBody RecoveryPasswordRequest request) {
        log.info("recovery check password: {}", request.getEmail());

        User user = userService.findByEmail(request.getEmail());

        if (Objects.nonNull(user)) {
            String recoveryCode = user.getRecoveryCode();
            String emailCode = request.getEmailCode();
            SystemParameter bySystemParameterKey = systemParameterService.findBySystemParameterKey("recovery_time_period");
            String systemParameterValue = bySystemParameterKey.getSystemParameterValue();
            int CODE_LIFETIME = Integer.parseInt(systemParameterValue);
            LocalDateTime recoveryRequestTime = user.getRecoveryRequestTime();

            LocalDateTime finishLifetimePeriod = recoveryRequestTime.plusHours(CODE_LIFETIME);
            LocalDateTime now = LocalDateTime.now();

            if (!recoveryCode.equals(emailCode)) {
                return ResponseEntity
                        .badRequest()
                        .body(new MessageResponse("Recovery code is not valid!"));
            } else if (now.isAfter(finishLifetimePeriod)) {
                return ResponseEntity
                        .badRequest()
                        .body(new MessageResponse("Recovery code lifetime is expired!"));
            } else {
                return ResponseEntity.ok(new MessageResponse("Email and code is valid!"));
            }

        } else {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("User for recover not found!"));
        }
    }

    @PostMapping(value = "/recovery/password/update", consumes = "application/json", produces = "application/json")
    public ResponseEntity<?> recoveryPasswordUpdate(@RequestBody RecoveryPasswordRequest request) {
        log.info("recovery update password: {}", request.getEmail());

        User user = userService.findByEmail(request.getEmail());

        if (Objects.nonNull(user)) {

            user.setPassword(request.getPassword());
            userService.update(user);
            return ResponseEntity.ok(new MessageResponse("Email has been changed successfully!"));

        } else {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("User for recover not found!"));
        }
    }


    @PostMapping(value = "/resend/email", consumes = "application/json", produces = "application/json")
    public ResponseEntity<?> resendEmail(@RequestBody EmailCodeRequest request) {
        try {
            User user = userService.findByEmail(request.getEmail());
            String code = randomizerUtils.generateEmailCode();
            user.setVerifyEmailCode(code);
            userService.update(user);
            emailService.sendSimpleEmail(user.getEmail(), code, EmailType.AUTH);
            return ResponseEntity.ok(new MessageResponse("Send email is successfully!"));
        } catch (Exception ex) {
            log.warn("Exception.", ex);

        }

        return ResponseEntity.badRequest().body(new MessageResponse("Bad send email!"));

    }

    @PostMapping(value = "/resend/recovery/email", consumes = "application/json", produces = "application/json")
    public ResponseEntity<?> recoveryPasswordResendEmail(@RequestBody EmailCodeRequest request) {
        User user = userService.findByEmail(request.getEmail());

        if (Objects.nonNull(user)) {
            String emailCode = randomizerUtils.generateEmailCode();
            user.setRecoveryCode(emailCode);
            user.setRecoveryRequestTime(LocalDateTime.now());
            userService.update(user);
            emailService.sendSimpleEmail(user.getEmail(), emailCode, EmailType.RECEIVE);

            return ResponseEntity.ok(new MessageResponse("Email code sent successfully!"));
        } else {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("User for recover not found!"));
        }

    }


}
