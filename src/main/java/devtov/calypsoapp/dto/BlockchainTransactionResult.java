package devtov.calypsoapp.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class BlockchainTransactionResult {
    private boolean isSuccessful;
    private BigDecimal amount;
}
