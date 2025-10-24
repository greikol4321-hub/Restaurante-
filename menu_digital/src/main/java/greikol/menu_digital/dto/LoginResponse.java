package greikol.menu_digital.dto;

public class LoginResponse {
    private UsuarioDTO usuario;

    // Constructors
    public LoginResponse() {}

    public LoginResponse(UsuarioDTO usuario) {
        this.usuario = usuario;
    }

    // Getters and Setters
    public UsuarioDTO getUsuario() {
        return usuario;
    }

    public void setUsuario(UsuarioDTO usuario) {
        this.usuario = usuario;
    }
}