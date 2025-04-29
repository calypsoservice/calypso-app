package devtov.calypsoapp.dto.api;


import ch.qos.logback.core.joran.spi.NoAutoStart;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoAutoStart
@ToString
@JsonIgnoreProperties(ignoreUnknown = true)
public class BTCTransDataResponse {

    private int vsize;
    private int locktime;
    private String txid;
    private int weight;
    private int confirmations;
    private int version;
    private List<Vout> vout;
    private String blockhash;
    private int size;
    private int blocktime;
    private List<Vin> vin;
    private String hex;
    private int time;
    private String hash;

}
