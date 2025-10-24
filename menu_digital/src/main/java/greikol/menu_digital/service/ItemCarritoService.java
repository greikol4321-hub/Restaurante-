package greikol.menu_digital.service;

import greikol.menu_digital.model.Carrito;
import greikol.menu_digital.model.ItemCarrito;
import greikol.menu_digital.model.Producto;
import greikol.menu_digital.repository.ItemCarritoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityNotFoundException;
import java.util.Optional;

@Service
public class ItemCarritoService {

    private final ItemCarritoRepository itemCarritoRepository;

    public ItemCarritoService(ItemCarritoRepository itemCarritoRepository) {
        this.itemCarritoRepository = itemCarritoRepository;
    }

    @Transactional
    public ItemCarrito agregarOActualizarItem(Carrito carrito, Producto producto, Integer cantidad) {
        if (cantidad <= 0) {
            throw new IllegalArgumentException("La cantidad debe ser mayor que cero");
        }

        Optional<ItemCarrito> itemExistente = itemCarritoRepository.findByCarritoAndProducto(carrito, producto);

        if (itemExistente.isPresent()) {
            ItemCarrito item = itemExistente.get();
            item.setCantidad(item.getCantidad() + cantidad);
            return itemCarritoRepository.save(item);
        } else {
            ItemCarrito nuevoItem = new ItemCarrito();
            nuevoItem.setCarrito(carrito);
            nuevoItem.setProducto(producto);
            nuevoItem.setCantidad(cantidad);
            nuevoItem.setPrecioUnitario(producto.getPrecio());
            carrito.addItem(nuevoItem);
            return itemCarritoRepository.save(nuevoItem);
        }
    }

    @Transactional
    public void eliminarItem(Carrito carrito, Long itemId) {
        ItemCarrito item = itemCarritoRepository.findById(itemId)
                .orElseThrow(() -> new EntityNotFoundException("Item no encontrado"));

        if (!item.getCarrito().getId().equals(carrito.getId())) {
            throw new IllegalArgumentException("El item no pertenece a este carrito");
        }

        carrito.removeItem(item);
        itemCarritoRepository.delete(item);
    }

    @Transactional
    public ItemCarrito actualizarCantidad(Long itemId, Integer nuevaCantidad) {
        if (nuevaCantidad <= 0) {
            throw new IllegalArgumentException("La cantidad debe ser mayor que cero");
        }

        ItemCarrito item = itemCarritoRepository.findById(itemId)
                .orElseThrow(() -> new EntityNotFoundException("Item no encontrado"));

        item.setCantidad(nuevaCantidad);
        return itemCarritoRepository.save(item);
    }
}