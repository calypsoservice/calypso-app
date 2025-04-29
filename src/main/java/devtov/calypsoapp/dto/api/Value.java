package devtov.calypsoapp.dto.api;

import lombok.Data;
import lombok.ToString;

@Data@ToString
public class Value {
    public int amount;
    public String data;
    public String owner_address;
    public String to_address;
}
