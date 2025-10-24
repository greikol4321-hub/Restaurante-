package greikol.menu_digital.service;

import greikol.menu_digital.model.Carrito;
import greikol.menu_digital.model.ItemCarrito;
import greikol.menu_digital.model.Producto;
import greikol.menu_digital.model.Usuario;
import greikol.menu_digital.repository.CarritoRepository;
import greikol.menu_digital.repository.ProductoRepository;
import greikol.menu_digital.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityNotFoundException;
import java.util.List;

@Service
public class CarritoService {

    private static final String CARRITO_NO_ENCONTRADO = "Carrito no encontrado";

    private final CarritoRepository carritoRepository;
    private final UsuarioRepository usuarioRepository;
    private final ProductoRepository productoRepository;
    private final ItemCarritoService itemCarritoService;

    public CarritoService(
            CarritoRepository carritoRepository,
            UsuarioRepository usuarioRepository,
            ProductoRepository productoRepository,
            ItemCarritoService itemCarritoService) {
        this.carritoRepository = carritoRepository;
        this.usuarioRepository = usuarioRepository;
        this.productoRepository = productoRepository;
        this.itemCarritoService = itemCarritoService;
    }

    private static final String USUARIO_NO_ENCONTRADO = "Usuario no encontrado";
    private static final String CARRITO_INACTIVO = "El carrito no está activo";
    private static final String CARRITO_ACTIVO_NO_ENCONTRADO = "Carrito activo no encontrado";
    private static final String PRODUCTO_NO_ENCONTRADO = "Producto no encontrado";
    private static final String CARRITO_VACIO = "No se puede crear un pedido con un carrito vacío";

    @Transactional
    public Carrito crearOObtenerCarrito(Long usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new EntityNotFoundException(USUARIO_NO_ENCONTRADO));

        return carritoRepository.findByUsuarioAndActivoTrue(usuario)
                .orElseGet(() -> {
                    Carrito nuevoCarrito = new Carrito();
                    nuevoCarrito.setUsuario(usuario);
                    return carritoRepository.save(nuevoCarrito);
                });
    }

    @Transactional(readOnly = true)
    public Carrito obtenerCarritoActivo(Long usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new EntityNotFoundException(USUARIO_NO_ENCONTRADO));

        return carritoRepository.findByUsuarioAndActivoTrue(usuario)
                .orElseThrow(() -> new EntityNotFoundException(CARRITO_ACTIVO_NO_ENCONTRADO));
    }

    @Transactional
    public ItemCarrito agregarProducto(Long carritoId, Long productoId, Integer cantidad) {
        Carrito carrito = carritoRepository.findById(carritoId)
                .orElseThrow(() -> new EntityNotFoundException(CARRITO_NO_ENCONTRADO));

        if (!carrito.isActivo()) {
            throw new IllegalStateException(CARRITO_INACTIVO);
        }

        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new EntityNotFoundException(PRODUCTO_NO_ENCONTRADO));

        return itemCarritoService.agregarOActualizarItem(carrito, producto, cantidad);
    }

    @Transactional
    public void eliminarProducto(Long carritoId, Long itemId) {
        Carrito carrito = carritoRepository.findById(carritoId)
                .orElseThrow(() -> new EntityNotFoundException(CARRITO_NO_ENCONTRADO));

        if (!carrito.isActivo()) {
            throw new IllegalStateException(CARRITO_INACTIVO);
        }

        itemCarritoService.eliminarItem(carrito, itemId);
    }

    @Transactional
    public void vaciarCarrito(Long carritoId) {
        Carrito carrito = carritoRepository.findById(carritoId)
                .orElseThrow(() -> new EntityNotFoundException(CARRITO_NO_ENCONTRADO));

        if (!carrito.isActivo()) {
            throw new IllegalStateException(CARRITO_INACTIVO);
        }

        carrito.getItemsCarrito().clear();
        carritoRepository.save(carrito);
    }

    @Transactional
    public void convertirEnPedido(Long carritoId) {
        Carrito carrito = carritoRepository.findById(carritoId)
                .orElseThrow(() -> new EntityNotFoundException(CARRITO_NO_ENCONTRADO));

        if (!carrito.isActivo()) {
            throw new IllegalStateException(CARRITO_INACTIVO);
        }

        if (carrito.getItemsCarrito().isEmpty()) {
            throw new IllegalStateException(CARRITO_VACIO);
        }

        // Aquí puedes implementar la lógica para crear el pedido
        // Por ejemplo, crear un nuevo Pedido y asignar los items del carrito

        // Marcar el carrito como inactivo
        carrito.setActivo(false);
        carritoRepository.save(carrito);
    }

    @Transactional(readOnly = true)
    public List<ItemCarrito> listarProductosCarrito(Long carritoId) {
        Carrito carrito = carritoRepository.findById(carritoId)
                .orElseThrow(() -> new EntityNotFoundException(CARRITO_NO_ENCONTRADO));

        return carrito.getItemsCarrito();
    }
}