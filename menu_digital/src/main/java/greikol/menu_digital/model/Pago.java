package greikol.menu_digital.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "pagos")
public class Pago {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pedido_id")
    private Pedido pedido;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mesa_orden_id")
    private MesaOrden mesaOrden;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal monto;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MetodoPago metodoPago;

    @Column(nullable = false)
    private LocalDateTime fechaPago;

    @PrePersist
    protected void onCreate() {
        if (fechaPago == null) {
            fechaPago = LocalDateTime.now();
        }
        // Validar que haya al menos un tipo de pago asociado
        if (pedido == null && mesaOrden == null) {
            throw new IllegalStateException("El pago debe estar asociado a un Pedido o una MesaOrden");
        }
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Pedido getPedido() {
        return pedido;
    }

    public void setPedido(Pedido pedido) {
        this.pedido = pedido;
    }

    public MesaOrden getMesaOrden() {
        return mesaOrden;
    }

    public void setMesaOrden(MesaOrden mesaOrden) {
        this.mesaOrden = mesaOrden;
    }

    public BigDecimal getMonto() {
        return monto;
    }

    public void setMonto(BigDecimal monto) {
        this.monto = monto;
    }

    public MetodoPago getMetodoPago() {
        return metodoPago;
    }

    public void setMetodoPago(MetodoPago metodoPago) {
        this.metodoPago = metodoPago;
    }

    public LocalDateTime getFechaPago() {
        return fechaPago;
    }

    public void setFechaPago(LocalDateTime fechaPago) {
        this.fechaPago = fechaPago;
    }
}