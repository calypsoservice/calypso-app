package devtov.calypsoapp.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Network {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String name;
    private String symbol;
    private String node;
    private String testNode;
    private String image;
    private int chainId;
    @JsonIgnore
    @OneToMany(mappedBy = "network")
    private List<Token> tokens = new ArrayList<>();

}
