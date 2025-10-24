package greikol.menu_digital.repository;

import greikol.menu_digital.model.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
    Categoria findByNombreIgnoreCase(String nombre);
}
