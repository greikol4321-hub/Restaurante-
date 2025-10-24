package greikol.menu_digital.controller;

import greikol.menu_digital.model.Carrito;
import greikol.menu_digital.model.ItemCarrito;
import greikol.menu_digital.service.CarritoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/carritos")
public class CarritoController {

    private final CarritoService carritoService;

    public CarritoController(CarritoService carritoService) {
        this.carritoService = carritoService;
    }

    @PostMapping
    public ResponseEntity<Carrito> crearCarrito(@RequestBody Map<String, Long> request) {
        Long usuarioId = request.get("usuarioId");
        return ResponseEntity.ok(carritoService.crearOObtenerCarrito(usuarioId));
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<Carrito> obtenerCarritoActivo(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(carritoService.obtenerCarritoActivo(usuarioId));
    }

    @PostMapping("/{carritoId}/items")
    public ResponseEntity<ItemCarrito> agregarProducto(
            @PathVariable Long carritoId,
            @RequestBody Map<String, Object> request) {
        Long productoId = Long.parseLong(request.get("productoId").toString());
        Integer cantidad = Integer.parseInt(request.get("cantidad").toString());
        return ResponseEntity.ok(carritoService.agregarProducto(carritoId, productoId, cantidad));
    }

    @DeleteMapping("/{carritoId}/items/{itemId}")
    public ResponseEntity<Void> eliminarProducto(
            @PathVariable Long carritoId,
            @PathVariable Long itemId) {
        carritoService.eliminarProducto(carritoId, itemId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{carritoId}/vaciar")
    public ResponseEntity<Void> vaciarCarrito(@PathVariable Long carritoId) {
        carritoService.vaciarCarrito(carritoId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{carritoId}/items")
    public ResponseEntity<List<ItemCarrito>> listarProductosCarrito(@PathVariable Long carritoId) {
        return ResponseEntity.ok(carritoService.listarProductosCarrito(carritoId));
    }

    @PutMapping("/{carritoId}/convertir-pedido")
    public ResponseEntity<Void> convertirEnPedido(@PathVariable Long carritoId) {
        carritoService.convertirEnPedido(carritoId);
        return ResponseEntity.ok().build();
    }
}