package devtov.calypsoapp.dto.api;

import lombok.Data;
import lombok.ToString;

import java.util.ArrayList;

@Data@ToString
public class RawData {
    public ArrayList<Contract> contract;
    public String ref_block_bytes;
    public String ref_block_hash;
    public long expiration;
    public int fee_limit;
    public long timestamp;
}
