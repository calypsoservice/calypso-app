package devtov.calypsoapp.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ErrorMessageModel {
    public int code;
    public String message;
}
