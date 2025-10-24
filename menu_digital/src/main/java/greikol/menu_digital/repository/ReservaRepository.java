package greikol.menu_digital.repository;

import greikol.menu_digital.model.Reserva;
import greikol.menu_digital.model.EstadoReserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;

public interface ReservaRepository extends JpaRepository<Reserva, Long> {
    @Query("SELECT r FROM Reserva r JOIN FETCH r.usuario WHERE r.usuario.id = :usuarioId")
    List<Reserva> findByUsuarioId(@Param("usuarioId") Long usuarioId);
    
    @Query("SELECT r FROM Reserva r JOIN FETCH r.usuario")
    List<Reserva> findAllWithUsuario();
    
    @Query("SELECT r FROM Reserva r JOIN FETCH r.usuario WHERE r.id = :id")
    Reserva findByIdWithUsuario(@Param("id") Long id);
    
    List<Reserva> findByEstado(EstadoReserva estado);
    List<Reserva> findByFechaReservaBetween(LocalDateTime inicio, LocalDateTime fin);
}