package devtov.calypsoapp.dto;

import ch.qos.logback.core.joran.spi.NoAutoStart;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class AdminStakeModel {
    private long userStakeId;
    private BigDecimal reward;
    private boolean isClosed;
    private String dateCreated;
}
