package greikol.menu_digital.repository;

import greikol.menu_digital.model.Pedido;
import greikol.menu_digital.model.EstadoPedido;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    List<Pedido> findByUsuarioId(Long usuarioId);
    List<Pedido> findByEstado(EstadoPedido estado);
    List<Pedido> findByEstadoIn(List<EstadoPedido> estados);
    List<Pedido> findByFechaPedidoBetween(LocalDateTime inicio, LocalDateTime fin);
    List<Pedido> findByUsuarioIdAndEstado(Long usuarioId, EstadoPedido estado);
}