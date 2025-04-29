package devtov.calypsoapp.payload.response;

import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class JwtResponse {
    private long id;
    private String username;
    private String email;
    private String token;
    private String type;
    private boolean isVerifyEmail;
    private List<String> roles = new ArrayList<>();
}
