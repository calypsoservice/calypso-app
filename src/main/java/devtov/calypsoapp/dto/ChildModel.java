package devtov.calypsoapp.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ChildModel {
    private long id;
    private String username;
    private String email;
    private String amountStake;
    private String amountParentReward;
}
