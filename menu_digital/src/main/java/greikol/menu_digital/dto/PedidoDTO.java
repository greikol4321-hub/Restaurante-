package greikol.menu_digital.dto;

import greikol.menu_digital.model.EstadoPedido;
import java.time.LocalDateTime;
import java.util.List;

public class PedidoDTO {
    private Long usuarioId;
    private EstadoPedido estado;
    private LocalDateTime fechaPedido;
    private List<DetallePedidoDTO> detallesPedido;

    // Getters y Setters
    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
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

    public List<DetallePedidoDTO> getDetallesPedido() {
        return detallesPedido;
    }

    public void setDetallesPedido(List<DetallePedidoDTO> detallesPedido) {
        this.detallesPedido = detallesPedido;
    }
}