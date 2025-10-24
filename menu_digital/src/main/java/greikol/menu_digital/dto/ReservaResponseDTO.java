package greikol.menu_digital.dto;

import greikol.menu_digital.model.EstadoReserva;
import java.time.LocalDateTime;

public class ReservaResponseDTO {
    private Long id;
    private Long usuarioId;
    private String usuarioNombre;
    private String usuarioApellido;
    private LocalDateTime fechaReserva;
    private Integer numeroPersonas;
    private String telefono;
    private EstadoReserva estado;

    // Constructor vacío
    public ReservaResponseDTO() {
    }

    // Constructor completo
    public ReservaResponseDTO(Long id, Long usuarioId, String usuarioNombre, String usuarioApellido,
                              LocalDateTime fechaReserva, Integer numeroPersonas, String telefono, EstadoReserva estado) {
        this.id = id;
        this.usuarioId = usuarioId;
        this.usuarioNombre = usuarioNombre;
        this.usuarioApellido = usuarioApellido;
        this.fechaReserva = fechaReserva;
        this.numeroPersonas = numeroPersonas;
        this.telefono = telefono;
        this.estado = estado;
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }

    public String getUsuarioNombre() {
        return usuarioNombre;
    }

    public void setUsuarioNombre(String usuarioNombre) {
        this.usuarioNombre = usuarioNombre;
    }

    public String getUsuarioApellido() {
        return usuarioApellido;
    }

    public void setUsuarioApellido(String usuarioApellido) {
        this.usuarioApellido = usuarioApellido;
    }

    public LocalDateTime getFechaReserva() {
        return fechaReserva;
    }

    public void setFechaReserva(LocalDateTime fechaReserva) {
        this.fechaReserva = fechaReserva;
    }

    public Integer getNumeroPersonas() {
        return numeroPersonas;
    }

    public void setNumeroPersonas(Integer numeroPersonas) {
        this.numeroPersonas = numeroPersonas;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public EstadoReserva getEstado() {
        return estado;
    }

    public void setEstado(EstadoReserva estado) {
        this.estado = estado;
    }
}
