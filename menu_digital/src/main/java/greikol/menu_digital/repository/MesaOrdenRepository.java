package greikol.menu_digital.repository;

import greikol.menu_digital.model.MesaOrden;
import greikol.menu_digital.model.EstadoMesaOrden;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MesaOrdenRepository extends JpaRepository<MesaOrden, Long> {
    List<MesaOrden> findByMeseroId(Long meseroId);
    
    List<MesaOrden> findByEstado(EstadoMesaOrden estado);
    
    List<MesaOrden> findByNumeroMesa(Integer numeroMesa);
    
    List<MesaOrden> findByMeseroIdAndEstado(Long meseroId, EstadoMesaOrden estado);
}