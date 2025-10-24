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
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final UsuarioRepository usuarioRepository;
    private final ProductoRepository productoRepository;

    public PedidoService(PedidoRepository pedidoRepository, 
                        UsuarioRepository usuarioRepository,
                        ProductoRepository productoRepository) {
        this.pedidoRepository = pedidoRepository;
        this.usuarioRepository = usuarioRepository;
        this.productoRepository = productoRepository;
    }

    public Pedido crearPedido(PedidoDTO pedidoDTO) {
        // Validaciones iniciales
        if (pedidoDTO == null) {
            throw new IllegalArgumentException("El pedido no puede ser nulo");
        }
        if (pedidoDTO.getUsuarioId() == null) {
            throw new IllegalArgumentException("El ID del usuario no puede ser nulo");
        }
        if (pedidoDTO.getDetallesPedido() == null || pedidoDTO.getDetallesPedido().isEmpty()) {
            throw new IllegalArgumentException("El pedido debe tener al menos un detalle");
        }

        // Validar usuario
        Usuario usuario = usuarioRepository.findById(pedidoDTO.getUsuarioId())
            .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado con ID: " + pedidoDTO.getUsuarioId()));

        Pedido pedido = new Pedido();
        pedido.setUsuario(usuario);
        pedido.setEstado(EstadoPedido.PENDIENTE);

        // Procesar detalles
        for (DetallePedidoDTO detalleDTO : pedidoDTO.getDetallesPedido()) {
            Producto producto = productoRepository.findById(detalleDTO.getProductoId())
                .orElseThrow(() -> new EntityNotFoundException("Producto no encontrado"));

            // Validaciones del detalle
            if (detalleDTO.getProductoId() == null) {
                throw new IllegalArgumentException("El ID del producto no puede ser nulo");
            }
            if (detalleDTO.getCantidad() == null || detalleDTO.getCantidad() <= 0) {
                throw new IllegalArgumentException("La cantidad debe ser mayor a 0 para el producto: " + producto.getNombre());
            }

            DetallePedido detalle = new DetallePedido();
            detalle.setProducto(producto);
            detalle.setCantidad(detalleDTO.getCantidad());
            detalle.setPrecioUnitario(producto.getPrecio());
            pedido.addDetalle(detalle);
        }

        return pedidoRepository.save(pedido);
    }

    public Pedido obtenerPorId(Long id) {
        return pedidoRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Pedido no encontrado"));
    }

    public List<Pedido> listarTodos() {
        return pedidoRepository.findAll();
    }

    public List<Pedido> listarPorUsuario(Long usuarioId) {
        return pedidoRepository.findByUsuarioId(usuarioId);
    }

    public List<Pedido> listarPorEstado(EstadoPedido estado) {
        return pedidoRepository.findByEstado(estado);
    }

    public List<Pedido> listarPedidosCocina() {
        // Retorna pedidos en estado PENDIENTE y PREPARANDO para la cocina
        return pedidoRepository.findByEstadoIn(
            List.of(EstadoPedido.PENDIENTE, EstadoPedido.PREPARANDO)
        );
    }

    public Pedido actualizarEstado(Long id, EstadoPedido nuevoEstado) {
        if (nuevoEstado == null) {
            throw new IllegalArgumentException("El nuevo estado no puede ser nulo");
        }

        Pedido pedido = obtenerPorId(id);
        EstadoPedido estadoActual = pedido.getEstado();
        
        // Validar transiciones de estado válidas
        if (estadoActual == EstadoPedido.CANCELADO || estadoActual == EstadoPedido.ENTREGADO) {
            throw new IllegalStateException("No se puede modificar un pedido que ya está " + estadoActual);
        }

        // Validar transiciones específicas permitidas
        switch (estadoActual) {
            case PENDIENTE:
                if (nuevoEstado != EstadoPedido.PREPARANDO && nuevoEstado != EstadoPedido.CANCELADO) {
                    throw new IllegalStateException("Desde PENDIENTE solo se puede pasar a PREPARANDO o CANCELADO");
                }
                break;
            case PREPARANDO:
                if (nuevoEstado != EstadoPedido.PREPARADO && nuevoEstado != EstadoPedido.CANCELADO) {
                    throw new IllegalStateException("Desde PREPARANDO solo se puede pasar a PREPARADO o CANCELADO");
                }
                break;
            case PREPARADO:
                if (nuevoEstado != EstadoPedido.COBRADO && nuevoEstado != EstadoPedido.CANCELADO) {
                    throw new IllegalStateException("Desde PREPARADO solo se puede pasar a COBRADO o CANCELADO");
                }
                break;
            case COBRADO:
                if (nuevoEstado != EstadoPedido.ENTREGADO && nuevoEstado != EstadoPedido.CANCELADO) {
                    throw new IllegalStateException("Desde COBRADO solo se puede pasar a ENTREGADO o CANCELADO");
                }
                break;
            case CANCELADO:
                throw new IllegalStateException("Un pedido CANCELADO no puede cambiar de estado");
            case ENTREGADO:
                throw new IllegalStateException("Un pedido ENTREGADO no puede cambiar de estado");
        }
        
        pedido.setEstado(nuevoEstado);
        return pedidoRepository.save(pedido);
    }

    public void eliminarPedido(Long id) {
        Pedido pedido = obtenerPorId(id);
        
        // Validar que no se pueda eliminar un pedido entregado o cancelado
        if (pedido.getEstado() == EstadoPedido.ENTREGADO || 
            pedido.getEstado() == EstadoPedido.CANCELADO) {
            throw new IllegalStateException("No se puede eliminar un pedido que ya está " + pedido.getEstado());
        }
        
        pedidoRepository.deleteById(id);
    }
}