package devtov.calypsoapp.configuration;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class AppConfiguration {

    @Bean
    public RestTemplate restTemplate() {

        return new RestTemplate();
    }

    @Bean
    public ObjectMapper objectMapper() {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
        objectMapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
        objectMapper.addMixIn(Object.class, IgnoreHibernatePropertiesInJackson.class);
        objectMapper.registerModule(new JavaTimeModule());
        return objectMapper;
    }


    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private abstract class IgnoreHibernatePropertiesInJackson {
    }
}
