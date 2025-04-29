package devtov.calypsoapp.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Token {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String smartContract;
    private String name;
    private String symbol;
    private int decimalLength;
    private String image;
    private boolean isNative;
    private double price;
    private String percentChange;
    @ManyToOne
    @JoinColumn(name = "network_id", nullable = false)
    private Network network;

}
