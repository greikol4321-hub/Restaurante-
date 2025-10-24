package greikol.menu_digital.repository;

import greikol.menu_digital.model.ItemCarrito;
import greikol.menu_digital.model.Carrito;
import greikol.menu_digital.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ItemCarritoRepository extends JpaRepository<ItemCarrito, Long> {
    Optional<ItemCarrito> findByCarritoAndProducto(Carrito carrito, Producto producto);
}