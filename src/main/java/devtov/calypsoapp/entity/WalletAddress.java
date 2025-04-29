package devtov.calypsoapp.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class WalletAddress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String address;
    @JsonIgnore
    private String privateKey;
    @JsonIgnore
    private String publikKey;
    @Column(precision = 32, scale = 8)
    private BigDecimal balance = new BigDecimal(0);
    @Transient
    private String balanceUSDT;
    @Transient
    private String amountStake;
    @Transient
    private String amountStakeUSDT;
    @ManyToOne
    @JoinColumn(name = "token_id", nullable = false)
    private Token token;
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "user_wallet_id", nullable = false)
    private UserWallet userWallet;

}
