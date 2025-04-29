package devtov.calypsoapp.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class TokenApiModel {
    private String name;
    private String symbol;
    @JsonProperty("id")
    private long tokenServiceId;
    @JsonProperty("quote")
    private TokenDataApiModel tokenDataApiModel;
}
