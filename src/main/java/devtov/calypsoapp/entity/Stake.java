package devtov.calypsoapp.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Stake {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private int periodDays;
    private double percentDay;
    private int minAmount;
    private int maxAmount;
    private String name;


}
