package greikol.menu_digital.controller;


import greikol.menu_digital.dto.ProductoDTO;
import greikol.menu_digital.model.Categoria;
import greikol.menu_digital.model.Producto;
import greikol.menu_digital.service.CategoriaService;
import greikol.menu_digital.service.ProductoService;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    private final ProductoService productoService;
    private final CategoriaService categoriaService; // Inyecta el servicio de categorías


    public ProductoController(ProductoService productoService, CategoriaService categoriaService) {
        this.productoService = productoService;
        this.categoriaService = categoriaService;
    }

    /**
     * Endpoint para crear un nuevo producto usando un DTO.
     * Método: POST /api/productos
     *
     * @param productoDTO El objeto ProductoDTO enviado en el cuerpo de la solicitud.
     * @return El producto creado con un estado HTTP 201 (Created), o un 404 si la categoría no existe.
     */
    @PostMapping
    public ResponseEntity<Producto> createProducto(@RequestBody ProductoDTO productoDTO) {
        // Buscar o crear la categoría por nombre
        if (productoDTO.getCategoriaNombre() == null || productoDTO.getCategoriaNombre().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        Categoria categoria = categoriaService.buscarOCrearPorNombre(productoDTO.getCategoriaNombre().trim());

        // Crear una nueva instancia de Producto
        Producto nuevoProducto = new Producto();
        nuevoProducto.setNombre(productoDTO.getNombre());
        nuevoProducto.setDescripcion(productoDTO.getDescripcion());
        nuevoProducto.setPrecio(productoDTO.getPrecio());
        nuevoProducto.setImagenUrl(productoDTO.getImagenUrl());
        nuevoProducto.setCategoria(categoria);

        Producto productoGuardado = productoService.guardarProducto(nuevoProducto);
        return ResponseEntity.status(HttpStatus.CREATED).body(productoGuardado);
    }

    @DeleteMapping("/all")
    public ResponseEntity<Void> deleteAllProductos() {
        productoService.eliminarTodosLosProductos();
        return ResponseEntity.noContent().build();
    }

    /**
     * Endpoint para obtener un producto por su ID.
     * Método: GET /api/productos/{id}
     *
     * @param id El ID del producto a buscar.
     * @return El producto encontrado con un estado HTTP 200, o 404 si no se encuentra.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Producto> getProductoById(@PathVariable Long id) {
        Optional<Producto> producto = productoService.obtenerProductoPorId(id);
        return producto.map(ResponseEntity::ok)
                   .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * Endpoint para obtener todos los productos.
     * Método: GET /api/productos
     *
     * @return Una lista de todos los productos con un estado HTTP 200.
     */
    @GetMapping
    public ResponseEntity<List<Producto>> getAllProductos() {
        List<Producto> productos = productoService.obtenerTodosLosProductos();
        return new ResponseEntity<>(productos, HttpStatus.OK);
    }

    /**
     * Endpoint para buscar productos por nombre o categoría.
     * GET /api/productos/buscar?query=texto
     */
    @GetMapping("/buscar")
    public ResponseEntity<List<Producto>> buscarProductos(@RequestParam("query") String query) {
        List<Producto> productos = productoService.buscarPorNombreOCategoria(query);
        return new ResponseEntity<>(productos, HttpStatus.OK);
    }

    /**
     * Endpoint para actualizar un producto existente.
     * PUT /api/productos/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<Producto> updateProducto(@PathVariable Long id, @RequestBody ProductoDTO productoDTO) {
        // Buscar o crear la categoría por nombre
        if (productoDTO.getCategoriaNombre() == null || productoDTO.getCategoriaNombre().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        Categoria categoria = categoriaService.buscarOCrearPorNombre(productoDTO.getCategoriaNombre().trim());
        Optional<Producto> productoOpt = productoService.obtenerProductoPorId(id);
        if (productoOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Producto producto = productoOpt.get();
        producto.setNombre(productoDTO.getNombre());
        producto.setDescripcion(productoDTO.getDescripcion());
        producto.setPrecio(productoDTO.getPrecio());
        producto.setImagenUrl(productoDTO.getImagenUrl());
        producto.setCategoria(categoria);
        Producto actualizado = productoService.guardarProducto(producto);
    return new ResponseEntity<>(actualizado, HttpStatus.OK);
    }

    /**
     * Endpoint para eliminar un producto por ID.
     * DELETE /api/productos/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProducto(@PathVariable Long id) {
        boolean eliminado = productoService.eliminarProductoPorId(id);
        if (eliminado) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}