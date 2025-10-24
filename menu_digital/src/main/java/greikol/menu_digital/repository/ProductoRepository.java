package greikol.menu_digital.repository;

import greikol.menu_digital.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {
    List<Producto> findByNombreContainingIgnoreCase(String nombre);
    List<Producto> findByCategoria_NombreContainingIgnoreCase(String categoriaNombre);

    @Query("SELECT p FROM Producto p WHERE LOWER(p.nombre) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.categoria.nombre) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Producto> buscarPorNombreOCategoria(@Param("query") String query);
}
