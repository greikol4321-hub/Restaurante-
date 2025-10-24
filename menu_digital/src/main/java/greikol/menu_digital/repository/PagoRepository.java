package greikol.menu_digital.repository;

import greikol.menu_digital.model.Pago;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PagoRepository extends JpaRepository<Pago, Long> {
    List<Pago> findByPedidoId(Long pedidoId);
    boolean existsByPedidoId(Long pedidoId);
    
    List<Pago> findByMesaOrdenId(Long mesaOrdenId);
    boolean existsByMesaOrdenId(Long mesaOrdenId);
}