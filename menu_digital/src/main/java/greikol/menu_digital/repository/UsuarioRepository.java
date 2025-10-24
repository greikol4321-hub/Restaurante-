package greikol.menu_digital.repository;

import greikol.menu_digital.model.Usuario;
import greikol.menu_digital.model.RolUsuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmail(String email);
    
    List<Usuario> findByRol(RolUsuario rol);
    
    List<Usuario> findByNombreContainingIgnoreCaseOrApellidoContainingIgnoreCaseOrEmailContainingIgnoreCase(
        String nombre, String apellido, String email);
    
    @Query("SELECT u FROM Usuario u WHERE " +
           "LOWER(u.nombre) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(u.apellido) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Usuario> buscarPorNombreOCorreo(@Param("query") String query);
}