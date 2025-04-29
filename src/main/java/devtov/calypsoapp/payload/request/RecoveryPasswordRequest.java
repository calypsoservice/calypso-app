package devtov.calypsoapp.payload.request;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class RecoveryPasswordRequest {
    private String email;
    private String emailCode;
    private String password;
}
