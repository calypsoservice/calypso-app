package devtov.calypsoapp.dto.api;

import lombok.Data;
import lombok.Getter;
import lombok.ToString;

@Data@ToString
public class Parameter {
    public Value value;
    public String type_url;
}
