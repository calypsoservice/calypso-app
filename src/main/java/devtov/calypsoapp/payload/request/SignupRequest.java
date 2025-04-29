package devtov.calypsoapp.payload.request;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class SignupRequest {
    private String username;
    private String password;
    private String email;
    private String refValue;
}
