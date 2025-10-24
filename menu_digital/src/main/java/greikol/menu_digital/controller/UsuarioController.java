package greikol.menu_digital.controller;

import greikol.menu_digital.model.Usuario;
import greikol.menu_digital.model.RolUsuario;
import greikol.menu_digital.model.MesaOrden;
import greikol.menu_digital.service.UsuarioService;
import greikol.menu_digital.dto.ActualizarUsuarioDTO;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class UsuarioController {
    
    private static final Logger logger = LoggerFactory.getLogger(UsuarioController.class);
    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping
    public ResponseEntity<List<Usuario>> obtenerTodos() {
        return ResponseEntity.ok(usuarioService.obtenerTodos());
    }

    @GetMapping("/meseros")
    public ResponseEntity<List<Usuario>> obtenerMeseros() {
        return ResponseEntity.ok(usuarioService.obtenerPorRol(RolUsuario.MESERO));
    }

    @PostMapping
    public ResponseEntity<Usuario> crearUsuario(@Valid @RequestBody Usuario usuario) {
        return ResponseEntity.ok(usuarioService.guardarUsuario(usuario));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarUsuario(
            @PathVariable("id") Long id,
            @Valid @RequestBody ActualizarUsuarioDTO usuarioDTO) {
        try {
            logger.info("Iniciando actualización de usuario con ID: {}", id);
            logger.debug("Datos recibidos: {}", usuarioDTO);
            
            usuarioDTO.setId(id);
            Usuario usuarioActualizado = usuarioService.actualizarUsuario(usuarioDTO);
            
            logger.info("Usuario actualizado exitosamente con ID: {}", id);
            return ResponseEntity.ok(usuarioActualizado);
            
        } catch (EntityNotFoundException e) {
            logger.error("Usuario no encontrado con ID: {}", id);
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
            
        } catch (IllegalArgumentException e) {
            logger.error("Error de validación al actualizar usuario con ID: {}: {}", id, e.getMessage());
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
            
        } catch (Exception e) {
            logger.error("Error inesperado al actualizar usuario con ID: {}", id, e);
            return ResponseEntity.status(500).body(Map.of(
                "error", "Error interno del servidor: " + e.getMessage(),
                "detalle", e.getClass().getSimpleName()
            ));
        }
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<Usuario> cambiarEstado(
            @PathVariable("id") Long id,
            @RequestBody Map<String, Boolean> estado) {
        return ResponseEntity.ok(usuarioService.cambiarEstado(id, estado.get("activo")));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> eliminarUsuario(@PathVariable("id") Long id) {
        usuarioService.eliminarUsuario(id);
        return ResponseEntity.ok(Map.of("message", "Usuario eliminado exitosamente"));
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<Usuario>> buscarUsuarios(@RequestParam String query) {
        return ResponseEntity.ok(usuarioService.buscarUsuarios(query));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> obtenerUsuario(@PathVariable("id") Long id) {
        return ResponseEntity.ok(usuarioService.obtenerPorId(id));
    }

    @PatchMapping("/{id}/password")
    public ResponseEntity<Void> actualizarPassword(
            @PathVariable("id") Long id,
            @RequestBody Map<String, String> passwords) {
        usuarioService.actualizarPassword(id, passwords.get("passwordActual"), passwords.get("nuevoPassword"));
        return ResponseEntity.ok().build();
    }

    @GetMapping("/roles")
    public ResponseEntity<List<RolUsuario>> obtenerRoles() {
        return ResponseEntity.ok(Arrays.asList(RolUsuario.values()));
    }

    @GetMapping("/{id}/ordenes")
    public ResponseEntity<List<MesaOrden>> obtenerOrdenesPorMesero(@PathVariable("id") Long id) {
        return ResponseEntity.ok(usuarioService.obtenerOrdenesPorMesero(id));
    }
}