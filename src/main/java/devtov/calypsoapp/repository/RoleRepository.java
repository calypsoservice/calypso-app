package devtov.calypsoapp.repository;


import devtov.calypsoapp.entity.Role;
import devtov.calypsoapp.entity.User;
import devtov.calypsoapp.enums.RoleType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Role findByRoleType(RoleType roleType);
}
