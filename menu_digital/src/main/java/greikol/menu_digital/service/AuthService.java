package greikol.menu_digital.service;

import greikol.menu_digital.dto.LoginResponse;
import greikol.menu_digital.dto.RegisterRequest;
import greikol.menu_digital.dto.RegisterResponse;
import greikol.menu_digital.dto.UsuarioDTO;
import greikol.menu_digital.model.Usuario;
import greikol.menu_digital.model.RolUsuario;
import greikol.menu_digital.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public LoginResponse login(String email, String password) {
        // Buscar usuario por email
        Usuario usuario = usuarioRepository.findByEmail(email)
            .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        // Verificar contraseña
        if (!passwordEncoder.matches(password, usuario.getPassword())) {
            throw new IllegalArgumentException("Contraseña incorrecta");
        }

        // Crear DTO con la información necesaria
        UsuarioDTO usuarioDTO = new UsuarioDTO(
            usuario.getId(),
            usuario.getNombre(),
            usuario.getApellido(),
            usuario.getEmail(),
            usuario.getRol().toString()
        );

        // Retornar solo la información del usuario
        return new LoginResponse(usuarioDTO);
    }

    public RegisterResponse register(RegisterRequest request) {
        // Verificar si el email ya existe
        if (usuarioRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("El email ya está registrado");
        }

        // Crear nuevo usuario
        Usuario usuario = new Usuario();
        usuario.setNombre(request.getNombre());
        usuario.setApellido(request.getApellido());
        usuario.setEmail(request.getEmail());
        usuario.setPassword(passwordEncoder.encode(request.getPassword()));
        
        // Asignar rol (por defecto CLIENTE si no se especifica)
        String rolStr = request.getRol() != null ? request.getRol() : "CLIENTE";
        try {
            usuario.setRol(RolUsuario.valueOf(rolStr.toUpperCase()));
        } catch (IllegalArgumentException _) {
            usuario.setRol(RolUsuario.CLIENTE);
        }

        Usuario usuarioGuardado = usuarioRepository.save(usuario);

        // Crear DTO para la respuesta
        UsuarioDTO usuarioDTO = new UsuarioDTO(
            usuarioGuardado.getId(),
            usuarioGuardado.getNombre(),
            usuarioGuardado.getApellido(),
            usuarioGuardado.getEmail(),
            usuarioGuardado.getRol().toString()
        );

        return new RegisterResponse("Usuario registrado exitosamente", usuarioDTO);
    }
}