package devtov.calypsoapp.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class TransactionModel {

    private long id;
    private String hash;
    private String status;
    private String type;
    private String amount;
    private String receiveHash;
    private String memo;
    private String dateCreated;
    private boolean isHidden;
    private String receiveAddress;
    private long   userId;
    private long   walletAddressId;

}
