package greikol.menu_digital.controller;

import greikol.menu_digital.dto.ReservaResponseDTO;
import greikol.menu_digital.model.Reserva;
import greikol.menu_digital.model.EstadoReserva;
import greikol.menu_digital.service.ReservaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reservas")
public class ReservaController {

    private final ReservaService reservaService;

    public ReservaController(ReservaService reservaService) {
        this.reservaService = reservaService;
    }

    @PostMapping
    public ResponseEntity<Reserva> crearReserva(@RequestBody Reserva reserva) {
        return new ResponseEntity<>(reservaService.guardarReserva(reserva), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ReservaResponseDTO>> listarReservas() {
        return ResponseEntity.ok(reservaService.listarTodas());
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<ReservaResponseDTO>> listarReservasPorUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(reservaService.listarPorUsuario(usuarioId));
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<ReservaResponseDTO> actualizarEstado(
            @PathVariable Long id,
            @RequestParam String estado) {
        
        // Convertir string a enum
        EstadoReserva estadoReserva;
        try {
            estadoReserva = EstadoReserva.valueOf(estado.toUpperCase());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
        
        Reserva reserva = reservaService.actualizarEstado(id, estadoReserva);
        
        // Convertir a DTO antes de retornar
        ReservaResponseDTO dto = new ReservaResponseDTO(
            reserva.getId(),
            reserva.getUsuario().getId(),
            reserva.getUsuario().getNombre(),
            reserva.getUsuario().getApellido(),
            reserva.getFechaReserva(),
            reserva.getNumeroPersonas(),
            reserva.getTelefono(),
            reserva.getEstado()
        );
        
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/disponibilidad")
    public ResponseEntity<Map<String, Object>> verificarDisponibilidad(
            @RequestParam String fecha,
            @RequestParam int personas) {
        return ResponseEntity.ok(reservaService.verificarDisponibilidad(fecha, personas));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> eliminarReserva(@PathVariable Long id) {
        reservaService.eliminarReserva(id);
        return ResponseEntity.ok(Map.of("message", "Reserva cancelada exitosamente"));
    }
}