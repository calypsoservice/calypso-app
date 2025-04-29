package devtov.calypsoapp.dto;


import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class UserModel {

    private long id;
    private String username;
    private String email;
    private boolean isVerifyEmail;
    private String refValue;


}
