package greikol.menu_digital.controller;
import greikol.menu_digital.model.Categoria;
import greikol.menu_digital.service.CategoriaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/categorias")
public class CategoriaController {

    private final CategoriaService categoriaService;


    public CategoriaController(CategoriaService categoriaService) {
        this.categoriaService = categoriaService;
    }

    /**
     * Endpoint para crear una nueva categoría.
     * Método: POST /api/categorias
     *
     * @param categoria El objeto Categoria enviado en el cuerpo de la solicitud.
     * @return La categoría creada con un estado HTTP 201 (Created).
     */
    @PostMapping
    public ResponseEntity<Categoria> createCategoria(@RequestBody Categoria categoria) {
        Categoria nuevaCategoria = categoriaService.guardarCategoria(categoria);
        return new ResponseEntity<>(nuevaCategoria, HttpStatus.CREATED);
    }

    /**
     * Endpoint para obtener una categoría por su ID.
     * Método: GET /api/categorias/{id}
     *
     * @param id El ID de la categoría a buscar.
     * @return La categoría encontrada con un estado HTTP 200, o 404 si no se encuentra.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Categoria> getCategoriaById(@PathVariable Long id) {
        Optional<Categoria> categoria = categoriaService.obtenerCategoriaPorId(id);
        return categoria.map(ResponseEntity::ok)
                   .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * Endpoint para obtener todas las categorías.
     * Método: GET /api/categorias
     *
     * @return Una lista de todas las categorías con un estado HTTP 200.
     */
    @GetMapping
    public ResponseEntity<List<Categoria>> getAllCategorias() {
        List<Categoria> categorias = categoriaService.obtenerTodasLasCategorias();
        return new ResponseEntity<>(categorias, HttpStatus.OK);
    }

    /**
     * Endpoint para eliminar una categoría por su ID.
     * Método: DELETE /api/categorias/{id}
     *
     * @param id El ID de la categoría a eliminar.
     * @return Una respuesta con estado HTTP 204 (No Content).
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategoria(@PathVariable Long id) {
        categoriaService.eliminarCategoria(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}