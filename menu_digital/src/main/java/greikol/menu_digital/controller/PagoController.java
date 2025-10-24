package greikol.menu_digital.controller;

import greikol.menu_digital.model.Pago;
import greikol.menu_digital.service.PagoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/pagos")
public class PagoController {

    private final PagoService pagoService;

    public PagoController(PagoService pagoService) {
        this.pagoService = pagoService;
    }

    @PostMapping
    public ResponseEntity<Pago> crearPago(@RequestBody Pago pago) {
        return new ResponseEntity<>(pagoService.guardarPago(pago), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Pago>> listarPagos() {
        return ResponseEntity.ok(pagoService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pago> obtenerPago(@PathVariable Long id) {
        return ResponseEntity.ok(pagoService.obtenerPorId(id));
    }

    @GetMapping("/pedido/{pedidoId}")
    public ResponseEntity<List<Pago>> listarPagosPorPedido(@PathVariable Long pedidoId) {
        return ResponseEntity.ok(pagoService.listarPorPedido(pedidoId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarPago(@PathVariable Long id) {
        pagoService.eliminarPago(id);
        return ResponseEntity.noContent().build();
    }
}