package greikol.menu_digital.controller;

import greikol.menu_digital.model.MesaOrden;
import greikol.menu_digital.model.EstadoMesaOrden;
import greikol.menu_digital.dto.MesaOrdenDTO;
import greikol.menu_digital.service.MesaOrdenService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.stream.Collectors;

import java.util.List;

@RestController
@RequestMapping("/api/mesas-ordenes")
public class MesaOrdenController {

    private final MesaOrdenService mesaOrdenService;

   
    public MesaOrdenController(MesaOrdenService mesaOrdenService) {
        this.mesaOrdenService = mesaOrdenService;
    }

    @PostMapping
    public ResponseEntity<MesaOrden> crearOrden(@RequestBody MesaOrdenDTO ordenDTO) {
        return new ResponseEntity<>(mesaOrdenService.crearOrden(ordenDTO), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<MesaOrden>> listarOrdenes() {
        return ResponseEntity.ok(mesaOrdenService.listarOrdenes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MesaOrden> obtenerOrden(@PathVariable Long id) {
        return ResponseEntity.ok(mesaOrdenService.obtenerPorId(id));
    }

    @GetMapping("/mesero/{meseroId}")
    public ResponseEntity<List<MesaOrden>> listarOrdenesPorMesero(@PathVariable Long meseroId) {
        return ResponseEntity.ok(mesaOrdenService.listarOrdenesPorMesero(meseroId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MesaOrden> actualizarOrden(
            @PathVariable Long id,
            @RequestBody MesaOrdenDTO ordenDTO) {
        return ResponseEntity.ok(mesaOrdenService.actualizarOrden(id, ordenDTO));
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<MesaOrden> actualizarEstadoOrden(
            @PathVariable Long id,
            @RequestBody EstadoUpdateRequest request) {
        try {
            System.out.println("Recibida petición para actualizar estado de orden " + id);
            System.out.println("Request body: " + request);
            
            if (request == null || request.getEstado() == null) {
                String error = "El estado no puede ser nulo";
                System.out.println(error);
                return ResponseEntity.badRequest().body(null);
            }
            
            System.out.println("Estado recibido: " + request.getEstado());
            EstadoMesaOrden nuevoEstado = EstadoMesaOrden.valueOf(request.getEstado().toUpperCase());
            System.out.println("Estado convertido a enum: " + nuevoEstado);
            
            MesaOrden orden = mesaOrdenService.actualizarEstado(id, nuevoEstado);
            System.out.println("Estado actualizado correctamente");
            return ResponseEntity.ok(orden);
            
        } catch (IllegalArgumentException ex) {
            String error = "Estado inválido. Debe ser uno de: " + 
                String.join(", ", Arrays.stream(EstadoMesaOrden.values())
                    .map(Enum::name)
                    .toList());
            System.out.println(error);
            System.out.println("Error completo: " + ex.getMessage());
            return ResponseEntity.badRequest().body(null);
        } catch (Exception ex) {
            System.out.println("Error inesperado: " + ex.getMessage());
            ex.printStackTrace();
            throw ex;
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarOrden(@PathVariable Long id) {
        mesaOrdenService.eliminarOrden(id);
        return ResponseEntity.noContent().build();
    }

    // Clase interna para el request de actualización de estado
    public static class EstadoUpdateRequest {
        private String estado;

        public String getEstado() {
            return estado;
        }

        public void setEstado(String estado) {
            this.estado = estado;
        }
    }
}