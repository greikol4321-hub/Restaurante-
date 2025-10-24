package greikol.menu_digital.model;

/**
 * Enum que controla el flujo de estados de los pedidos.
 */
public enum EstadoPedido {
    /**
     * Pedido recibido, esperando preparación
     */
    PENDIENTE,
    
    /**
     * Pedido en proceso de preparación en cocina
     */
    PREPARANDO,
    
    /**
     * Pedido listo para entrega/servir
     */
    PREPARADO,
    
    /**
     * Pedido facturado al cliente
     */
    COBRADO,
    
    /**
     * Pedido entregado al cliente final
     */
    ENTREGADO,
    
    /**
     * Pedido cancelado por alguna razón
     */
    CANCELADO
}