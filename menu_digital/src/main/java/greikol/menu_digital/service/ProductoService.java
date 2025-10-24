package greikol.menu_digital.service;

import greikol.menu_digital.model.Producto;
import greikol.menu_digital.repository.ProductoRepository;
import org.springframework.stereotype.Service;

import greikol.menu_digital.exception.ProductoNoEncontradoException;

import java.util.List;
import java.util.Optional;

@Service

public class ProductoService {

    private final ProductoRepository productoRepository;

    public ProductoService (ProductoRepository productoRepository){
        this.productoRepository=productoRepository;
    }

    public Producto guardarProducto(Producto producto) {
		return productoRepository.save(producto);
	}

	public Optional<Producto> obtenerProductoPorId(Long id) {
		return productoRepository.findById(id);
	}

	public List<Producto> obtenerTodosLosProductos() {
		return productoRepository.findAll();
	}

	public Producto actualizarProducto(Long id, Producto productoActualizado) {
		return productoRepository.findById(id).map(producto -> {
			if (productoActualizado.getNombre() != null) {
				producto.setNombre(productoActualizado.getNombre());
			}
			if (productoActualizado.getDescripcion() != null) {
				producto.setDescripcion(productoActualizado.getDescripcion());
			}
			if (productoActualizado.getPrecio() != null) {
				producto.setPrecio(productoActualizado.getPrecio());
			}
			if (productoActualizado.getImagenUrl() != null) {
				producto.setImagenUrl(productoActualizado.getImagenUrl());
			}
			if (productoActualizado.getCategoria() != null) {
				producto.setCategoria(productoActualizado.getCategoria());
			}
			return productoRepository.save(producto);
		}).orElseThrow(() -> new ProductoNoEncontradoException("Producto con ID " + id + " no encontrado."));
	}

	public void eliminarProducto(Long id) {
		   if (productoRepository.existsById(id)) {
			   productoRepository.deleteById(id);
		   } else {
			   throw new ProductoNoEncontradoException("Producto con ID " + id + " no encontrado para eliminar.");
		   }
	}

	public List<Producto> buscarPorNombreOCategoria(String query) {
		return productoRepository.buscarPorNombreOCategoria(query);
	}

    public boolean eliminarProductoPorId(Long id) {
		if (productoRepository.existsById(id)) {
			productoRepository.deleteById(id);
			return true;
		} else {
			return false;
		}
	}

    public void eliminarTodosLosProductos() {
        productoRepository.deleteAll();
    }
}









