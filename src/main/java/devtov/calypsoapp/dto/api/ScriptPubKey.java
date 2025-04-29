package devtov.calypsoapp.dto.api;

import ch.qos.logback.core.joran.spi.NoAutoStart;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@AllArgsConstructor
@NoAutoStart
@ToString
@JsonIgnoreProperties(ignoreUnknown = true)
public class ScriptPubKey {
   private String address;
   private String asm;
   private String hex;
   private String type;
   private String desc;
}
