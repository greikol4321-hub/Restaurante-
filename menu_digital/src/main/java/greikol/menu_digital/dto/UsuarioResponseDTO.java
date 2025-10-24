package greikol.menu_digital.dto;

import greikol.menu_digital.model.RolUsuario;
import greikol.menu_digital.model.Usuario;
import java.time.LocalDateTime;

public class UsuarioResponseDTO {
    private Long id;
    private String nombre;
    private String apellido;
    private String email;
    private RolUsuario rol;
    private LocalDateTime fechaCreacion;
    private Boolean activo;

    public UsuarioResponseDTO(Usuario usuario) {
        this.id = usuario.getId();
        this.nombre = usuario.getNombre();
        this.apellido = usuario.getApellido();
        this.email = usuario.getEmail();
        this.rol = usuario.getRol();
        this.fechaCreacion = usuario.getFechaCreacion();
        this.activo = usuario.getActivo();
    }

    // Getters
    public Long getId() { return id; }
    public String getNombre() { return nombre; }
    public String getApellido() { return apellido; }
    public String getEmail() { return email; }
    public RolUsuario getRol() { return rol; }
    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public Boolean getActivo() { return activo; }
}