package devtov.calypsoapp.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class StakeModel {

    private long userId;
    private long stakeId;
    private long tokenId;
    private BigDecimal amount;

}
