package devtov.calypsoapp.payload.request;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class EmailCodeRequest {
    private String email;
    private String emailCode;
}
