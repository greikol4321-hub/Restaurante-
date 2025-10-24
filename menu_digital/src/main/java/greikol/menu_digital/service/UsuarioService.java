package greikol.menu_digital.service;

import greikol.menu_digital.model.Usuario;
import greikol.menu_digital.model.RolUsuario;
import greikol.menu_digital.model.MesaOrden;
import greikol.menu_digital.repository.UsuarioRepository;
import greikol.menu_digital.repository.MesaOrdenRepository;
import greikol.menu_digital.dto.ActualizarUsuarioDTO;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UsuarioService {
    private static final Logger logger = LoggerFactory.getLogger(UsuarioService.class);
    private static final String USUARIO_NO_ENCONTRADO = "Usuario no encontrado";
    
    private final UsuarioRepository usuarioRepository;
    private final MesaOrdenRepository mesaOrdenRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(
            UsuarioRepository usuarioRepository,
            MesaOrdenRepository mesaOrdenRepository,
            PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.mesaOrdenRepository = mesaOrdenRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<Usuario> obtenerTodos() {
        return usuarioRepository.findAll();
    }

    public List<Usuario> obtenerPorRol(RolUsuario rol) {
        return usuarioRepository.findByRol(rol);
    }

    public Usuario guardarUsuario(Usuario usuario) {
        if (usuarioRepository.findByEmail(usuario.getEmail()).isPresent()) {
            throw new IllegalArgumentException("El email ya está registrado");
        }
        
        // Asegurar que los campos requeridos estén establecidos
        if (usuario.getActivo() == null) {
            usuario.setActivo(true);
        }
        if (usuario.getFechaCreacion() == null) {
            usuario.setFechaCreacion(LocalDateTime.now());
        }
        
        // Encriptar la contraseña
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        
        return usuarioRepository.save(usuario);
    }

    public Usuario actualizarUsuario(ActualizarUsuarioDTO usuarioDTO) {
        logger.debug("Iniciando actualización de usuario: {}", usuarioDTO.getId());
        
        // Validar ID
        if (usuarioDTO.getId() == null) {
            logger.error("Intento de actualización sin ID de usuario");
            throw new IllegalArgumentException("El ID del usuario es requerido para la actualización");
        }

        // Validar campos obligatorios
        if (usuarioDTO.getNombre() == null || usuarioDTO.getNombre().trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre es obligatorio");
        }
        if (usuarioDTO.getApellido() == null || usuarioDTO.getApellido().trim().isEmpty()) {
            throw new IllegalArgumentException("El apellido es obligatorio");
        }
        if (usuarioDTO.getEmail() == null || usuarioDTO.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("El email es obligatorio");
        }
        if (usuarioDTO.getRol() == null) {
            throw new IllegalArgumentException("El rol es obligatorio");
        }

        // Buscar usuario existente
        Usuario usuarioExistente = usuarioRepository.findById(usuarioDTO.getId())
            .orElseThrow(() -> {
                logger.error("Usuario no encontrado con ID: {}", usuarioDTO.getId());
                return new EntityNotFoundException(USUARIO_NO_ENCONTRADO);
            });
        
        // Verificar si el nuevo email ya existe para otro usuario
        Optional<Usuario> usuarioConEmail = usuarioRepository.findByEmail(usuarioDTO.getEmail().trim());
        if (usuarioConEmail.isPresent() && !usuarioConEmail.get().getId().equals(usuarioDTO.getId())) {
            logger.error("Email duplicado encontrado: {} para usuario ID: {}", usuarioDTO.getEmail(), usuarioDTO.getId());
            throw new IllegalArgumentException("El email ya está registrado por otro usuario");
        }
        
        try {
            // Actualizar campos básicos con limpieza de espacios
            usuarioExistente.setNombre(usuarioDTO.getNombre().trim());
            usuarioExistente.setApellido(usuarioDTO.getApellido().trim());
            usuarioExistente.setEmail(usuarioDTO.getEmail().trim());
            usuarioExistente.setRol(usuarioDTO.getRol());
            
            if (usuarioDTO.getActivo() != null) {
                usuarioExistente.setActivo(usuarioDTO.getActivo());
            }
            
            // Solo actualizar la contraseña si se proporciona una nueva
            if (usuarioDTO.getPassword() != null && !usuarioDTO.getPassword().trim().isEmpty()) {
                usuarioExistente.setPassword(passwordEncoder.encode(usuarioDTO.getPassword().trim()));
            }
            
            Usuario usuarioActualizado = usuarioRepository.save(usuarioExistente);
            logger.info("Usuario actualizado exitosamente: {}", usuarioActualizado.getId());
            return usuarioActualizado;
            
        } catch (Exception e) {
            logger.error("Error al actualizar usuario ID: {}", usuarioDTO.getId(), e);
            throw new RuntimeException("Error al actualizar el usuario: " + e.getMessage());
        }
    }

    public Usuario cambiarEstado(Long id, Boolean activo) {
        Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException(USUARIO_NO_ENCONTRADO));
        
        usuario.setActivo(activo);
        return usuarioRepository.save(usuario);
    }

    public void eliminarUsuario(Long id) {
        usuarioRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException(USUARIO_NO_ENCONTRADO));
        usuarioRepository.deleteById(id);
    }

    public List<Usuario> buscarUsuarios(String query) {
        return usuarioRepository.findByNombreContainingIgnoreCaseOrApellidoContainingIgnoreCaseOrEmailContainingIgnoreCase(
            query, query, query);
    }

    public Usuario obtenerPorId(Long id) {
        return usuarioRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado con ID: " + id));
    }

    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    public void eliminarPorId(Long id) {
        usuarioRepository.deleteById(id);
    }

    public Optional<Usuario> buscarPorEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }

    public List<Usuario> buscarPorNombreOCorreo(String query) {
        return usuarioRepository.buscarPorNombreOCorreo(query);
    }

    public Usuario actualizarPerfil(Long id, Usuario usuarioActualizado) {
        Usuario usuarioExistente = obtenerPorId(id);
        
        usuarioExistente.setNombre(usuarioActualizado.getNombre());
        usuarioExistente.setApellido(usuarioActualizado.getApellido());
        usuarioExistente.setEmail(usuarioActualizado.getEmail());
        usuarioExistente.setRol(usuarioActualizado.getRol());
        usuarioExistente.setActivo(usuarioActualizado.getActivo());
        
        return usuarioRepository.save(usuarioExistente);
    }

    public void actualizarPassword(Long id, String passwordActual, String nuevoPassword) {
        Usuario usuario = obtenerPorId(id);
        
        if (!passwordEncoder.matches(passwordActual, usuario.getPassword())) {
            throw new IllegalArgumentException("La contraseña actual es incorrecta");
        }
        
        usuario.setPassword(passwordEncoder.encode(nuevoPassword));
        usuarioRepository.save(usuario);
    }

    public List<MesaOrden> obtenerOrdenesPorMesero(Long meseroId) {
        return mesaOrdenRepository.findByMeseroId(meseroId);
    }
}