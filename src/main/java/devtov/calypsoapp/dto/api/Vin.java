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
public class Vin {

    public long sequence;
    public ScriptSig scriptSig;
    public String txid;
    public List<String> txinwitness;
    public int vout;

}
