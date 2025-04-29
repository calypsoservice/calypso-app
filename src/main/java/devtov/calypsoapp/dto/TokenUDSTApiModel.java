package devtov.calypsoapp.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class TokenUDSTApiModel {
    private BigDecimal price;
    @JsonProperty("percent_change_24h")
    private String percentChange24h;
}
