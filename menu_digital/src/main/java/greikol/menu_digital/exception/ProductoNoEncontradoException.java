package greikol.menu_digital.exception;

public class ProductoNoEncontradoException extends RuntimeException {
    public ProductoNoEncontradoException(String mensaje) {
        super(mensaje);
    }
}