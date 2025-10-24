package greikol.menu_digital.dto;

public class RegisterResponse {
    private String message;
    private UsuarioDTO usuario;

    public RegisterResponse() {}

    public RegisterResponse(String message, UsuarioDTO usuario) {
        this.message = message;
        this.usuario = usuario;
    }

    // Getters y Setters
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public UsuarioDTO getUsuario() {
        return usuario;
    }

    public void setUsuario(UsuarioDTO usuario) {
        this.usuario = usuario;
    }
}