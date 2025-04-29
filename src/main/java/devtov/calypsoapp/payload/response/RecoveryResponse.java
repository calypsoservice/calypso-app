package devtov.calypsoapp.payload.response;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class RecoveryResponse {
    private int recoveryCode;
    private boolean isValid;
}
