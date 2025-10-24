package greikol.menu_digital.dto;

import java.util.List;

public class MesaOrdenDTO {
    private Integer numeroMesa;
    private Long meseroId;
    private List<DetalleMesaOrdenDTO> detalles;

    // Getters y Setters
    public Integer getNumeroMesa() {
        return numeroMesa;
    }

    public void setNumeroMesa(Integer numeroMesa) {
        this.numeroMesa = numeroMesa;
    }

    public Long getMeseroId() {
        return meseroId;
    }

    public void setMeseroId(Long meseroId) {
        this.meseroId = meseroId;
    }

    public List<DetalleMesaOrdenDTO> getDetalles() {
        return detalles;
    }

    public void setDetalles(List<DetalleMesaOrdenDTO> detalles) {
        this.detalles = detalles;
    }
}