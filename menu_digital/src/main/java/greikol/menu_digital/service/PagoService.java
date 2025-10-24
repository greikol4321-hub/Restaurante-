package greikol.menu_digital.service;

import greikol.menu_digital.model.Pago;
import greikol.menu_digital.model.Pedido;
import greikol.menu_digital.model.MesaOrden;
import greikol.menu_digital.model.EstadoPedido;
import greikol.menu_digital.model.EstadoMesaOrden;
import greikol.menu_digital.repository.PagoRepository;
import greikol.menu_digital.repository.PedidoRepository;
import greikol.menu_digital.repository.MesaOrdenRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityNotFoundException;
import java.util.List;

@Service
@Transactional
public class PagoService {

    private final PagoRepository pagoRepository;
    private final PedidoRepository pedidoRepository;
    private final MesaOrdenRepository mesaOrdenRepository;

    public PagoService(PagoRepository pagoRepository, PedidoRepository pedidoRepository, MesaOrdenRepository mesaOrdenRepository) {
        this.pagoRepository = pagoRepository;
        this.pedidoRepository = pedidoRepository;
        this.mesaOrdenRepository = mesaOrdenRepository;
    }

    public Pago guardarPago(Pago pago) {
        // Validar que el monto sea positivo
        if (pago.getMonto().signum() <= 0) {
            throw new IllegalArgumentException("El monto del pago debe ser mayor a cero");
        }

        // Procesar pago de Pedido (app)
        if (pago.getPedido() != null && pago.getPedido().getId() != null) {
            Pedido pedido = pedidoRepository.findById(pago.getPedido().getId())
                .orElseThrow(() -> new EntityNotFoundException("Pedido no encontrado con ID: " + pago.getPedido().getId()));

            // Validar que el pedido no haya sido pagado ya
            if (pagoRepository.existsByPedidoId(pedido.getId())) {
                throw new IllegalStateException("El pedido ya ha sido pagado");
            }

            // Validar que el pedido esté en estado que permita el pago
            if (pedido.getEstado() == EstadoPedido.CANCELADO) {
                throw new IllegalStateException("No se puede pagar un pedido cancelado");
            }

            // Actualizar el estado del pedido a COBRADO
            pedido.setEstado(EstadoPedido.COBRADO);
            pedidoRepository.save(pedido);
        }
        // Procesar pago de MesaOrden
        else if (pago.getMesaOrden() != null && pago.getMesaOrden().getId() != null) {
            MesaOrden mesaOrden = mesaOrdenRepository.findById(pago.getMesaOrden().getId())
                .orElseThrow(() -> new EntityNotFoundException("Mesa Orden no encontrada con ID: " + pago.getMesaOrden().getId()));

            // Validar que la orden no haya sido pagada ya
            if (pagoRepository.existsByMesaOrdenId(mesaOrden.getId())) {
                throw new IllegalStateException("La orden de mesa ya ha sido pagada");
            }

            // Validar que la orden esté en estado que permita el pago
            if (mesaOrden.getEstado() == EstadoMesaOrden.CANCELADO) {
                throw new IllegalStateException("No se puede pagar una orden cancelada");
            }

            // Actualizar el estado de la orden a COBRADO
            mesaOrden.setEstado(EstadoMesaOrden.COBRADO);
            mesaOrdenRepository.save(mesaOrden);
        } else {
            throw new IllegalArgumentException("El pago debe estar asociado a un Pedido o una Mesa Orden");
        }

        return pagoRepository.save(pago);
    }

    public Pago obtenerPorId(Long id) {
        return pagoRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Pago no encontrado con ID: " + id));
    }

    public List<Pago> listarTodos() {
        return pagoRepository.findAll();
    }

    public List<Pago> listarPorPedido(Long pedidoId) {
        // Validar que el pedido existe
        if (!pedidoRepository.existsById(pedidoId)) {
            throw new EntityNotFoundException("Pedido no encontrado con ID: " + pedidoId);
        }
        return pagoRepository.findByPedidoId(pedidoId);
    }

    public void eliminarPago(Long id) {
        Pago pago = obtenerPorId(id);
        
        // Actualizar el estado según el tipo de pago
        if (pago.getPedido() != null) {
            // Es un pago de pedido de app
            Pedido pedido = pago.getPedido();
            pedido.setEstado(EstadoPedido.PREPARADO); // Volvemos al estado anterior al pago
            pedidoRepository.save(pedido);
        } else if (pago.getMesaOrden() != null) {
            // Es un pago de orden de mesa
            MesaOrden mesaOrden = pago.getMesaOrden();
            mesaOrden.setEstado(EstadoMesaOrden.ENTREGADO); // Volvemos al estado anterior al pago
            mesaOrdenRepository.save(mesaOrden);
        }
        
        pagoRepository.deleteById(id);
    }
}