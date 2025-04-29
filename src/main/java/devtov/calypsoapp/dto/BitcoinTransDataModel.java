package devtov.calypsoapp.dto;


import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class BitcoinTransDataModel {
    private String address;
    private int confirmation;
    private BigDecimal value;
}
