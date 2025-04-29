package devtov.calypsoapp.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class BalanceResponseModel {
    private int id;
    private String result;
    private String jsonrpc;
}
