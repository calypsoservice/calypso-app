package devtov.calypsoapp.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class TokenDataApiModel {
    @JsonProperty("USD")
    private TokenUDSTApiModel tokenUDSTApiModel;
}
