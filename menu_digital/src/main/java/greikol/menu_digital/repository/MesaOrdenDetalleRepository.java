package greikol.menu_digital.repository;

import greikol.menu_digital.model.MesaOrdenDetalle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface MesaOrdenDetalleRepository extends JpaRepository<MesaOrdenDetalle, Long> {
    List<MesaOrdenDetalle> findByMesaOrdenId(Long mesaOrdenId);
    
    @Query("SELECT d.producto.id, SUM(d.cantidad) as total FROM MesaOrdenDetalle d GROUP BY d.producto.id ORDER BY total DESC")
    List<Object[]> findProductosMasPedidos();
    
    @Query("SELECT d FROM MesaOrdenDetalle d WHERE d.mesaOrden.id = :mesaOrdenId")
    List<MesaOrdenDetalle> findDetallesByMesaOrden(@Param("mesaOrdenId") Long mesaOrdenId);
}