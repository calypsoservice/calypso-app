package devtov.calypsoapp.dto.api;

import lombok.Data;
import lombok.ToString;

import java.util.ArrayList;

@Data@ToString
public class ResponseTonTransaction {
    public ArrayList<Ret> ret;
    public ArrayList<String> signature;
    public String txID;
    public RawData raw_data;
    public String raw_data_hex;
}
