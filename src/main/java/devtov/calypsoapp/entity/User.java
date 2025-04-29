package devtov.calypsoapp.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import devtov.calypsoapp.dto.ChildModel;
import devtov.calypsoapp.dto.UserData;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String username;
    @JsonIgnore
    private String password;
    private String email;
    private boolean isVerifyEmail;
    private boolean isBlocked;
    private LocalDateTime dateCreated = LocalDateTime.now();
    @JsonIgnore
    private String verifyEmailCode;
    @JsonIgnore
    private String recoveryCode;
    @JsonIgnore
    private String refValue;
    @JsonIgnore
    private LocalDateTime recoveryRequestTime;
    @JsonIgnore
    @Column(columnDefinition = "TEXT")
    private String description;
    @Transient
    private UserData userData;


    @Transient
    private String totalReward;
    @Transient
    private String totalStake;
    @Transient
    private int totalChildUser;
    @Transient
    private int totalActiveChildUser;
    @Transient
    private String totalRefReward;
    // Общая вывод средств с сервисва
    @Transient
    private String totalPayout;
    @Transient
    private long unreadCount;

    @Transient
    private List<ChildModel> childLVL1 = new ArrayList<>();
    @Transient
    private List<ChildModel> childLVL2 = new ArrayList<>();
    @Transient
    private List<ChildModel> childLVL3 = new ArrayList<>();
    @Transient
    private List<ChildModel> childLVL4 = new ArrayList<>();
    @Transient
    private List<ChildModel> childLVL5 = new ArrayList<>();
    @Transient
    private List<ChildModel> childLVL6 = new ArrayList<>();
    @Transient
    private List<ChildModel> childLVL7 = new ArrayList<>();





    @ManyToMany
    @JoinTable(name = "user_role",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id"))
    private List<Role> roles = new ArrayList<>();
//    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    @JsonIgnore
    @OneToMany(mappedBy = "user")
    private List<UserMessage> messages = new ArrayList<>();
    @JsonIgnore
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_user_id")
    private User parentUser;
    @JsonIgnore
    @OneToMany(mappedBy = "parentUser")
    private List<User> childUsers = new ArrayList<>();
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_wallet_id", referencedColumnName = "id")
    private UserWallet userWallet;
    @OneToMany(mappedBy = "user")
    private List<UserStake> userStakes = new ArrayList<>();
    @OneToMany(mappedBy = "user")
    private List<WalletTransaction> walletTransactions = new ArrayList<>();



    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles.stream()
                .map(role -> new SimpleGrantedAuthority(role.getRoleType().name()))
                .collect(Collectors.toList());
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
