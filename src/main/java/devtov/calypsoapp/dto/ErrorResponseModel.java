package devtov.calypsoapp.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.thetransactioncompany.jsonrpc2.JSONRPC2Message;
import com.thetransactioncompany.jsonrpc2.JSONRPC2Parser;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ErrorResponseModel {
    private int id;
    @JsonProperty("error")
    private ErrorMessageModel errorMessageModel;
    private String jsonrpc;
}
