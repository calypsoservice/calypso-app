package devtov.calypsoapp.dto;


import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class UserData {
    private long id;
    private String description;
    private boolean isBlocked;
    private String password;
    private String mnemonic;
}
