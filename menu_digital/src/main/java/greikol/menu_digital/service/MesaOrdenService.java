package greikol.menu_digital.service;

import greikol.menu_digital.model.*;
import greikol.menu_digital.dto.*;
import greikol.menu_digital.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityNotFoundException;

import java.util.List;

@Service
@Transactional
public class MesaOrdenService {

    private final MesaOrdenRepository mesaOrdenRepository;
    private final UsuarioRepository usuarioRepository;
    private final ProductoRepository productoRepository;

    public MesaOrdenService(MesaOrdenRepository mesaOrdenRepository, 
                           UsuarioRepository usuarioRepository,
                           ProductoRepository productoRepository) {
        this.mesaOrdenRepository = mesaOrdenRepository;
        this.usuarioRepository = usuarioRepository;
        this.productoRepository = productoRepository;
    }

    public MesaOrden crearOrden(MesaOrdenDTO ordenDTO) {
        // Validar mesero
        Usuario mesero = usuarioRepository.findById(ordenDTO.getMeseroId())
            .orElseThrow(() -> new EntityNotFoundException("Mesero no encontrado"));

        MesaOrden orden = new MesaOrden();
        orden.setNumeroMesa(ordenDTO.getNumeroMesa());
        orden.setMesero(mesero);
        orden.setEstado(EstadoMesaOrden.PENDIENTE);

        // Procesar detalles
        for (DetalleMesaOrdenDTO detalleDTO : ordenDTO.getDetalles()) {
            Producto producto = productoRepository.findById(detalleDTO.getProductoId())
                .orElseThrow(() -> new EntityNotFoundException("Producto no encontrado"));

            // Validar cantidad
            if (detalleDTO.getCantidad() <= 0) {
                throw new IllegalArgumentException("La cantidad debe ser mayor a 0");
            }

            MesaOrdenDetalle detalle = new MesaOrdenDetalle();
            detalle.setProducto(producto);
            detalle.setCantidad(detalleDTO.getCantidad());
            detalle.setPrecioUnitario(producto.getPrecio());
            detalle.setMesaOrden(orden);
            orden.getDetalles().add(detalle);
        }

        return mesaOrdenRepository.save(orden);
    }

    public MesaOrden guardarOrden(MesaOrden orden) {
        // Validar que el mesero existe
        Usuario mesero = usuarioRepository.findById(orden.getMesero().getId())
            .orElseThrow(() -> new EntityNotFoundException("Mesero no encontrado"));
        
        orden.setMesero(mesero);
        return mesaOrdenRepository.save(orden);
    }

    public MesaOrden obtenerPorId(Long id) {
        return mesaOrdenRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Orden no encontrada con ID: " + id));
    }

    public List<MesaOrden> listarOrdenesPorMesero(Long meseroId) {
        return mesaOrdenRepository.findByMeseroId(meseroId);
    }

    public MesaOrden actualizarEstado(Long id, EstadoMesaOrden nuevoEstado) {
        MesaOrden orden = obtenerPorId(id);
        System.out.println("=== [DEBUG] Actualizando estado de orden ===");
        System.out.println("ID: " + id);
        System.out.println("Estado actual: " + orden.getEstado());
        System.out.println("Nuevo estado solicitado: " + nuevoEstado);
        try {
            // Validar que no se pueda modificar una orden ya cobrada o pagada
            if (orden.getEstado() == EstadoMesaOrden.COBRADO || orden.getEstado() == EstadoMesaOrden.PAGADO) {
                String error = "No se puede modificar una orden que ya ha sido cobrada o pagada";
                System.out.println("[ERROR] " + error);
                throw new IllegalStateException(error);
            }

            // Validar transición de estado válida
            boolean transicionValida = esTransicionValida(orden.getEstado(), nuevoEstado);
            System.out.println("¿Transición válida?: " + transicionValida);
            if (!transicionValida) {
                String error = String.format(
                    "Transición de estado inválida: de %s a %s", 
                    orden.getEstado(), 
                    nuevoEstado);
                System.out.println("[ERROR] " + error);
                throw new IllegalStateException(error);
            }

            orden.setEstado(nuevoEstado);
            MesaOrden guardada = mesaOrdenRepository.save(orden);
            System.out.println("[OK] Estado actualizado correctamente");
            return guardada;
        } catch (Exception ex) {
            System.out.println("[EXCEPTION] " + ex.getClass().getSimpleName() + ": " + ex.getMessage());
            ex.printStackTrace();
            throw ex;
        }
    }

    public void eliminarOrden(Long id) {
        MesaOrden orden = obtenerPorId(id);
        
        // Validar que no se pueda eliminar una orden ya cobrada o pagada
        if (orden.getEstado() == EstadoMesaOrden.COBRADO || orden.getEstado() == EstadoMesaOrden.PAGADO) {
            throw new IllegalStateException("No se puede eliminar una orden que ya ha sido cobrada o pagada");
        }
        
        mesaOrdenRepository.deleteById(id);
    }

    private boolean esTransicionValida(EstadoMesaOrden estadoActual, EstadoMesaOrden nuevoEstado) {
        // Definir las transiciones permitidas
        switch (estadoActual) {
            case PENDIENTE:
                return nuevoEstado == EstadoMesaOrden.PREPARANDO;
            case PREPARANDO:
                return nuevoEstado == EstadoMesaOrden.LISTO;
            case LISTO:
                return nuevoEstado == EstadoMesaOrden.ENTREGADO;
            case ENTREGADO:
                return nuevoEstado == EstadoMesaOrden.COBRADO;
            case COBRADO:
                return nuevoEstado == EstadoMesaOrden.PAGADO;
            case PAGADO:
            case CANCELADO:
                return false; // Estados finales, no permiten transiciones
            default:
                return false;
        }
    }

    public MesaOrden actualizarOrden(Long id, MesaOrdenDTO ordenDTO) {
        MesaOrden orden = obtenerPorId(id);
        
        // Validar que no se pueda modificar una orden ya cobrada o pagada
        if (orden.getEstado() == EstadoMesaOrden.COBRADO || orden.getEstado() == EstadoMesaOrden.PAGADO) {
            throw new IllegalStateException("No se puede modificar una orden que ya ha sido cobrada o pagada");
        }
        
        // Actualizar número de mesa si es diferente
        if (ordenDTO.getNumeroMesa() != null) {
            orden.setNumeroMesa(ordenDTO.getNumeroMesa());
        }
        
        // Limpiar detalles existentes
        orden.getDetalles().clear();
        
        // Agregar nuevos detalles
        for (DetalleMesaOrdenDTO detalleDTO : ordenDTO.getDetalles()) {
            Producto producto = productoRepository.findById(detalleDTO.getProductoId())
                .orElseThrow(() -> new EntityNotFoundException("Producto no encontrado"));

            MesaOrdenDetalle detalle = new MesaOrdenDetalle();
            detalle.setProducto(producto);
            detalle.setCantidad(detalleDTO.getCantidad());
            detalle.setPrecioUnitario(producto.getPrecio());
            detalle.setMesaOrden(orden);
            orden.getDetalles().add(detalle);
        }
        
        return mesaOrdenRepository.save(orden);
    }

    public List<MesaOrden> listarOrdenes() {
        return mesaOrdenRepository.findAll();
    }
}