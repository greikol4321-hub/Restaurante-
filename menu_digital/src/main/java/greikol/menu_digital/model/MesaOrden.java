package greikol.menu_digital.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "mesas_ordenes")
public class MesaOrden {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer numeroMesa;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "mesero_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Usuario mesero;

    @Column(nullable = false)
    private LocalDateTime fechaCreacion;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoMesaOrden estado;

    @OneToMany(mappedBy = "mesaOrden", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JsonManagedReference
    private List<MesaOrdenDetalle> detalles = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        fechaCreacion = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getNumeroMesa() {
        return numeroMesa;
    }

    public void setNumeroMesa(Integer numeroMesa) {
        this.numeroMesa = numeroMesa;
    }

    public Usuario getMesero() {
        return mesero;
    }

    public void setMesero(Usuario mesero) {
        this.mesero = mesero;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public EstadoMesaOrden getEstado() {
        return estado;
    }

    public void setEstado(EstadoMesaOrden estado) {
        this.estado = estado;
    }

    public List<MesaOrdenDetalle> getDetalles() {
        return detalles;
    }

    public void setDetalles(List<MesaOrdenDetalle> detalles) {
        this.detalles = detalles;
    }
    
    // Método para calcular el total
    public java.math.BigDecimal getTotal() {
        return detalles.stream()
                .map(detalle -> detalle.getPrecioUnitario().multiply(java.math.BigDecimal.valueOf(detalle.getCantidad())))
                .reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add);
    }
}