package devtov.calypsoapp.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class WalletAddressModel {
    private String privateKey;
    private String publicKey;
    private String address;
}
