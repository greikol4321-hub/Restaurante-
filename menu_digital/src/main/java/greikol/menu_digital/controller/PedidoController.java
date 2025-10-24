package greikol.menu_digital.controller;

import greikol.menu_digital.model.Pedido;
import greikol.menu_digital.model.EstadoPedido;
import greikol.menu_digital.model.DetallePedido;
import greikol.menu_digital.dto.PedidoDTO;
import greikol.menu_digital.dto.PedidoResponseDTO;
import greikol.menu_digital.dto.DetallePedidoResponseDTO;
import greikol.menu_digital.service.PedidoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.time.LocalDateTime;


@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    private final PedidoService pedidoService;

    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    @PostMapping
    public ResponseEntity<Pedido> crearPedido(@RequestBody PedidoDTO pedidoDTO) {
        return new ResponseEntity<>(pedidoService.crearPedido(pedidoDTO), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<PedidoResponseDTO>> listarPedidos() {
        List<Pedido> pedidos = pedidoService.listarTodos();
        List<PedidoResponseDTO> pedidosDTO = pedidos.stream()
            .map(this::convertirAPedidoResponseDTO)
            .toList();
        return ResponseEntity.ok(pedidosDTO);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PedidoResponseDTO> obtenerPedido(@PathVariable Long id) {
        Pedido pedido = pedidoService.obtenerPorId(id);
        return ResponseEntity.ok(convertirAPedidoResponseDTO(pedido));
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<PedidoResponseDTO>> listarPedidosPorUsuario(@PathVariable Long usuarioId) {
        List<Pedido> pedidos = pedidoService.listarPorUsuario(usuarioId);
        List<PedidoResponseDTO> pedidosDTO = pedidos.stream()
            .distinct() // Eliminar duplicados basados en equals/hashCode
            .map(this::convertirAPedidoResponseDTO)
            .toList();
        return ResponseEntity.ok(pedidosDTO);
    }

    @GetMapping("/estado")
    public ResponseEntity<List<PedidoResponseDTO>> listarPedidosPorEstado(@RequestParam EstadoPedido estado) {
        List<Pedido> pedidos = pedidoService.listarPorEstado(estado);
        List<PedidoResponseDTO> pedidosDTO = pedidos.stream()
            .map(this::convertirAPedidoResponseDTO)
            .toList();
        return ResponseEntity.ok(pedidosDTO);
    }

    @GetMapping("/cocina")
    public ResponseEntity<List<PedidoResponseDTO>> listarPedidosCocina() {
        List<Pedido> pedidos = pedidoService.listarPedidosCocina();
        List<PedidoResponseDTO> pedidosDTO = pedidos.stream()
            .map(this::convertirAPedidoResponseDTO)
            .toList();
        return ResponseEntity.ok(pedidosDTO);
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<PedidoResponseDTO> actualizarEstadoPedido(
            @PathVariable Long id,
            @RequestBody EstadoUpdateRequest request) {
        Pedido pedido = pedidoService.actualizarEstado(id, request.getEstado());
        return ResponseEntity.ok(convertirAPedidoResponseDTO(pedido));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarPedido(@PathVariable Long id) {
        pedidoService.eliminarPedido(id);
        return ResponseEntity.noContent().build();
    }

    private PedidoResponseDTO convertirAPedidoResponseDTO(Pedido pedido) {
        if (pedido == null) return null;
        PedidoResponseDTO dto = new PedidoResponseDTO();
        dto.setId(pedido.getId());
        dto.setUsuarioId(pedido.getUsuario().getId());
        dto.setUsuarioNombre(pedido.getUsuario().getNombre());
        dto.setEstado(pedido.getEstado());
        // Asegurarse de que la fecha no sea nula
        dto.setFechaPedido(pedido.getFechaPedido() != null ? pedido.getFechaPedido() : LocalDateTime.now());
        
        List<DetallePedidoResponseDTO> detallesDTO = pedido.getDetalles().stream()
            .map(this::convertirADetalleResponseDTO)
            .toList();
        dto.setDetalles(detallesDTO);
        dto.calcularTotal();
        return dto;
    }

    private DetallePedidoResponseDTO convertirADetalleResponseDTO(DetallePedido detalle) {
        DetallePedidoResponseDTO dto = new DetallePedidoResponseDTO();
        dto.setId(detalle.getId());
        dto.setProductoId(detalle.getProducto().getId());
        dto.setNombreProducto(detalle.getProducto().getNombre());
        dto.setCantidad(detalle.getCantidad());
        dto.setPrecioUnitario(detalle.getPrecioUnitario());
        return dto;
    }

    // Clase interna para el request de actualización de estado
    public static class EstadoUpdateRequest {
        private EstadoPedido estado;

        public EstadoPedido getEstado() {
            return estado;
        }

        public void setEstado(EstadoPedido estado) {
            this.estado = estado;
        }
    }
}