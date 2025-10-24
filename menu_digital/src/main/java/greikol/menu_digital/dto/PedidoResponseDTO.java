package greikol.menu_digital.dto;

import greikol.menu_digital.model.EstadoPedido;
import java.time.LocalDateTime;
import java.util.List;
import java.math.BigDecimal;

public class PedidoResponseDTO {
    private Long id;
    private Long usuarioId;
    private String usuarioNombre;
    private EstadoPedido estado;
    private LocalDateTime fechaPedido;
    private List<DetallePedidoResponseDTO> detalles;
    private BigDecimal total;

    // Getters y setters
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

    public EstadoPedido getEstado() {
        return estado;
    }

    public void setEstado(EstadoPedido estado) {
        this.estado = estado;
    }

    public LocalDateTime getFechaPedido() {
        return fechaPedido;
    }

    public void setFechaPedido(LocalDateTime fechaPedido) {
        this.fechaPedido = fechaPedido;
    }

    public List<DetallePedidoResponseDTO> getDetalles() {
        return detalles;
    }

    public void setDetalles(List<DetallePedidoResponseDTO> detalles) {
        this.detalles = detalles;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }
    
    public void calcularTotal() {
        this.total = this.detalles.stream()
            .map(detalle -> detalle.getPrecioUnitario().multiply(BigDecimal.valueOf(detalle.getCantidad())))
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}