package greikol.menu_digital.repository;

import greikol.menu_digital.model.Carrito;
import greikol.menu_digital.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CarritoRepository extends JpaRepository<Carrito, Long> {
    Optional<Carrito> findByUsuarioAndActivoTrue(Usuario usuario);
}