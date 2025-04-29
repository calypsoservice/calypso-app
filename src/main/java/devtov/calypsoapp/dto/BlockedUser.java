package devtov.calypsoapp.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class BlockedUser {
    private long id;
    private boolean isBlocked;
}
