package greikol.menu_digital.service;

import greikol.menu_digital.model.Categoria;
import greikol.menu_digital.repository.CategoriaRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class CategoriaService {
    private final CategoriaRepository categoriaRepository;

    public CategoriaService(CategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    /**
     * Busca una categoría por nombre (ignorando mayúsculas/minúsculas).
     * Si no existe, la crea y la retorna.
     */
    public Categoria buscarOCrearPorNombre(String nombre) {
        Categoria categoria = categoriaRepository.findByNombreIgnoreCase(nombre);
        if (categoria == null) {
            categoria = new Categoria(nombre);
            categoria = categoriaRepository.save(categoria);
        }
        return categoria;
    }

    /**
     * Guarda una nueva categoría.
     *
     * @param categoria La categoría a guardar.
     * @return La categoría guardada.
     */
    public Categoria guardarCategoria(Categoria categoria) {
        return categoriaRepository.save(categoria);
    }

    /**
     * Obtiene una categoría por su ID.
     *
     * @param id El ID de la categoría.
     * @return Un Optional que puede contener la categoría si se encuentra.
     */
    public Optional<Categoria> obtenerCategoriaPorId(Long id) {
        return categoriaRepository.findById(id);
    }

    /**
     * Obtiene todas las categorías.
     *
     * @return Una lista de todas las categorías.
     */
    public List<Categoria> obtenerTodasLasCategorias() {
        return categoriaRepository.findAll();
    }

    /**
     * Elimina una categoría por su ID.
     *
     * @param id El ID de la categoría a eliminar.
     */
    public void eliminarCategoria(Long id) {
        categoriaRepository.deleteById(id);
    }
}