package greikol.menu_digital.model;

/**
 * Enum que define los roles de usuarios en el sistema del restaurante.
 */
public enum RolUsuario {
    /**
     * Administrador con acceso completo al sistema
     */
    ADMIN(5, "Administrador del sistema"),
    
    /**
     * Personal que maneja pagos y facturación
     */
    CAJERO(4, "Cajero del restaurante"),
    
    /**
     * Personal que atiende mesas y toma pedidos
     */
    MESERO(3, "Mesero del restaurante"),
    
    /**
     * Personal de cocina que prepara los alimentos
     */
    COCINERO(2, "Cocinero del restaurante"),
    
    /**
     * Usuarios finales que realizan pedidos
     */
    CLIENTE(1, "Cliente del restaurante");

    private final int nivel;
    private final String descripcion;

    RolUsuario(int nivel, String descripcion) {
        this.nivel = nivel;
        this.descripcion = descripcion;
    }

    public int getNivel() {
        return nivel;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public boolean tienePermiso(String permiso) {
        if (this == ADMIN) return true; // Admin tiene todos los permisos
        
        switch (this) {
            case CAJERO:
                return permiso.equals("pedidos.cobrar") || 
                       permiso.equals("pagos.procesar");
            case MESERO:
                return permiso.equals("mesas.gestionar") || 
                       permiso.equals("ordenes.crear") || 
                       permiso.equals("ordenes.actualizar");
            case COCINERO:
                return permiso.equals("pedidos.ver") || 
                       permiso.equals("pedidos.preparar");
            case CLIENTE:
                return permiso.equals("pedidos.crear") || 
                       permiso.equals("reservas.crear");
            default:
                return false;
        }
    }
}
