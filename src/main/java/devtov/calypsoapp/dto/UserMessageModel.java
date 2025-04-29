package devtov.calypsoapp.dto;


import jnr.constants.platform.PRIO;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class UserMessageModel {
    private long id;
    private String text;
    private boolean isAdmin;
    private long userId;
}
