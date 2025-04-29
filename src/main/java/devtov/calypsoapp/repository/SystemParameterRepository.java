package devtov.calypsoapp.repository;


import devtov.calypsoapp.entity.SystemParameter;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SystemParameterRepository extends JpaRepository<SystemParameter, Long> {
    SystemParameter findBySystemParameterKey(String systemParameterKey);
}
