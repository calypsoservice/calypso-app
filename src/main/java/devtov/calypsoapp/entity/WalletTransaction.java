package devtov.calypsoapp.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class WalletTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String hash;
    private String receiveHash;
    private String receiveAddress;
    private String memo;
    private boolean isHidden;

    @ManyToOne
    @JoinColumn(name = "user_stake_id")
    private UserStake userStake;
    @ManyToOne
    @JoinColumn(name = "status_id", nullable = false)
    private WalletTransactionStatus status;
    @ManyToOne
    @JoinColumn(name = "type_id_id", nullable = false)
    private WalletTransactionType type;
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    private LocalDateTime dateCreated = LocalDateTime.now();
    @Column(precision = 32, scale = 8)
    private BigDecimal amount;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "wallet_address_id", nullable = false)
    private WalletAddress walletAddress;

}
