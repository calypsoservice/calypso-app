package devtov.calypsoapp.service.repository;

import devtov.calypsoapp.entity.Role;
import devtov.calypsoapp.enums.RoleType;
import devtov.calypsoapp.repository.RoleRepository;
import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
@Slf4j
public class RoleService {

    private final RoleRepository roleRepository;


    public Role save(Role role) {
        return roleRepository.save(role);
    }

    public Role findById(long id) {
        return roleRepository.findById(id).orElse(null);
    }

    public List<Role> findAll() {
        return roleRepository.findAll();
    }

    public Role findByRoleType(RoleType roleType) {
        return roleRepository.findByRoleType(roleType);
    }
}
