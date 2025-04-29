package devtov.calypsoapp.dto.api;

import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class WalletApiModel {

    private DataApiModel data;
    private List<AddressApiModel> addresses = new ArrayList<>();
}
