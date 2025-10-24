package greikol.menu_digital.service;

import greikol.menu_digital.dto.ReservaResponseDTO;
import greikol.menu_digital.model.Reserva;
import greikol.menu_digital.model.EstadoReserva;
import greikol.menu_digital.model.Usuario;
import greikol.menu_digital.repository.ReservaRepository;
import greikol.menu_digital.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityNotFoundException;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class ReservaService {

    private final ReservaRepository reservaRepository;
    private final UsuarioRepository usuarioRepository;

    public ReservaService(ReservaRepository reservaRepository, UsuarioRepository usuarioRepository) {
        this.reservaRepository = reservaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public Reserva guardarReserva(Reserva reserva) {
        // Validar que el usuario existe y asignarlo a la reserva
        Usuario usuario = usuarioRepository.findById(reserva.getUsuario().getId())
            .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado con ID: " + reserva.getUsuario().getId()));
        reserva.setUsuario(usuario);
        
        // Validar fecha de reserva
        if (reserva.getFechaReserva().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("La fecha de reserva no puede ser en el pasado");
        }

        // Validar número de personas
        if (reserva.getNumeroPersonas() <= 0) {
            throw new IllegalArgumentException("El número de personas debe ser mayor a 0");
        }
        if (reserva.getNumeroPersonas() > 20) {
            throw new IllegalArgumentException("El número máximo de personas por reserva es 20");
        }

        // Validar teléfono
        if (reserva.getTelefono() == null || reserva.getTelefono().trim().isEmpty()) {
            throw new IllegalArgumentException("El teléfono es obligatorio");
        }
        if (!reserva.getTelefono().matches("\\d{4}-\\d{4}")) {
            throw new IllegalArgumentException("El teléfono debe tener el formato ####-####");
        }

        // Establecer estado inicial si no está establecido
        if (reserva.getEstado() == null) {
            reserva.setEstado(EstadoReserva.PENDIENTE);
        }

        return reservaRepository.save(reserva);
    }

    public Reserva obtenerPorId(Long id) {
        return reservaRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Reserva no encontrada con ID: " + id));
    }

    public List<ReservaResponseDTO> listarTodas() {
        List<Reserva> reservas = reservaRepository.findAllWithUsuario();
        
        // Convertir a DTO para evitar problemas de serialización con Hibernate Proxy
        return reservas.stream()
            .map(reserva -> new ReservaResponseDTO(
                reserva.getId(),
                reserva.getUsuario().getId(),
                reserva.getUsuario().getNombre(),
                reserva.getUsuario().getApellido(),
                reserva.getFechaReserva(),
                reserva.getNumeroPersonas(),
                reserva.getTelefono(),
                reserva.getEstado()
            ))
            .collect(Collectors.toList());
    }

    public void eliminarReserva(Long id) {
        Reserva reserva = obtenerPorId(id);
        
        // Validar que no se pueda eliminar una reserva completada o cancelada
        if (reserva.getEstado() == EstadoReserva.COMPLETADA || 
            reserva.getEstado() == EstadoReserva.CANCELADA) {
            throw new IllegalStateException("No se puede eliminar una reserva que ya está " + reserva.getEstado());
        }
        
        reservaRepository.deleteById(id);
    }

    public List<ReservaResponseDTO> listarPorUsuario(Long usuarioId) {
        // Validar que el usuario existe
        if (!usuarioRepository.existsById(usuarioId)) {
            throw new EntityNotFoundException("Usuario no encontrado con ID: " + usuarioId);
        }
        
        List<Reserva> reservas = reservaRepository.findByUsuarioId(usuarioId);
        
        // Convertir a DTO para evitar problemas de serialización con Hibernate Proxy
        return reservas.stream()
            .map(reserva -> new ReservaResponseDTO(
                reserva.getId(),
                reserva.getUsuario().getId(),
                reserva.getUsuario().getNombre(),
                reserva.getUsuario().getApellido(),
                reserva.getFechaReserva(),
                reserva.getNumeroPersonas(),
                reserva.getTelefono(),
                reserva.getEstado()
            ))
            .collect(Collectors.toList());
    }

    public Reserva actualizarEstado(Long id, EstadoReserva nuevoEstado) {
        // Cargar la reserva con el usuario para evitar LazyInitializationException
        Reserva reserva = reservaRepository.findByIdWithUsuario(id);
        
        if (reserva == null) {
            throw new EntityNotFoundException("Reserva no encontrada con ID: " + id);
        }
        
        // Validar transiciones de estado válidas
        if (reserva.getEstado() == EstadoReserva.CANCELADA || 
            reserva.getEstado() == EstadoReserva.COMPLETADA) {
            throw new IllegalStateException("No se puede modificar una reserva que ya está " + reserva.getEstado());
        }
        
        reserva.setEstado(nuevoEstado);
        return reservaRepository.save(reserva);
    }

    public Map<String, Object> verificarDisponibilidad(String fecha, int personas) {
        // Lógica para verificar disponibilidad
        LocalDateTime fechaInicio = LocalDateTime.parse(fecha + "T00:00:00");
        LocalDateTime fechaFin = fechaInicio.plusDays(1);

        List<Reserva> reservasDelDia = reservaRepository.findByFechaReservaBetween(fechaInicio, fechaFin);
        int totalPersonasReservadas = reservasDelDia.stream()
            .mapToInt(Reserva::getNumeroPersonas)
            .sum();

        int capacidadMaxima = 50;
        boolean hayEspacio = (totalPersonasReservadas + personas) <= capacidadMaxima;

        List<String> horariosDisponibles = List.of("18:00:00", "18:30:00", "19:00:00", "19:30:00", "20:00:00", "20:30:00");
        List<String> horariosOcupados = List.of("21:00:00", "21:30:00");

        Map<String, Object> disponibilidad = new HashMap<>();
        disponibilidad.put("fecha", fecha);
        disponibilidad.put("horariosDisponibles", hayEspacio ? horariosDisponibles : List.of());
        disponibilidad.put("horariosOcupados", horariosOcupados);
        disponibilidad.put("capacidadMaxima", capacidadMaxima);
        disponibilidad.put("reservasActuales", totalPersonasReservadas);

        return disponibilidad;
    }
}