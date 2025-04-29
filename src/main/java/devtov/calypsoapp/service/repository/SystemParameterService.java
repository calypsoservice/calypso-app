package devtov.calypsoapp.service.repository;

import devtov.calypsoapp.entity.SystemParameter;
import devtov.calypsoapp.repository.SystemParameterRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@AllArgsConstructor
public class SystemParameterService {

    private final SystemParameterRepository systemParameterRepository;

    public SystemParameter save(SystemParameter systemParameter) {
        return systemParameterRepository.save(systemParameter);
    }

    public SystemParameter update(SystemParameter systemParameter) {
        return save(systemParameter);
    }

    public List<SystemParameter> findAll() {
        return systemParameterRepository.findAll();
    }

    public SystemParameter findBySystemParameterKey(String systemParameterKey) {
        return systemParameterRepository.findBySystemParameterKey(systemParameterKey);
    }


}
