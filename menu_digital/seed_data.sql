-- Script para poblar la base de datos con datos de ejemplo
USE menu_digital;

-- Insertar Categorías
INSERT INTO categorias (nombre) VALUES
('Entradas'),
('Platos Fuertes'),
('Bebidas'),
('Postres'),
('Desayunos'),
('Ensaladas');

-- Insertar Productos de Entradas (categoria_id = 1)
INSERT INTO productos (nombre, descripcion, precio, categoria_id, imagen_url) VALUES
('Alitas BBQ', 'Deliciosas alitas con salsa BBQ casera', 4500.00, 1, 'https://images.unsplash.com/photo-1608039755401-742074f0548d?w=500'),
('Nachos Supreme', 'Nachos con queso, guacamole y jalapenos', 5200.00, 1, 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=500'),
('Dedos de Queso', 'Crujientes dedos de mozzarella con marinara', 3800.00, 1, 'https://images.unsplash.com/photo-1531749668029-2db88e4276c7?w=500'),
('Calamares Fritos', 'Aros de calamar empanizados con limon', 5800.00, 1, 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=500'),
('Bruschetta', 'Pan tostado con tomate, albahaca y ajo', 3200.00, 1, 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=500');

-- Insertar Productos de Platos Fuertes (categoria_id = 2)
INSERT INTO productos (nombre, descripcion, precio, categoria_id, imagen_url) VALUES
('Hamburguesa Clasica', 'Hamburguesa de res con queso, lechuga y tomate', 6500.00, 2, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500'),
('Pizza Margarita', 'Pizza tradicional con mozzarella y albahaca', 8500.00, 2, 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500'),
('Pasta Alfredo', 'Fettuccine en salsa cremosa de queso', 7200.00, 2, 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500'),
('Filete de Res', 'Filete de res termino medio con papas', 14500.00, 2, 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=500'),
('Pollo a la Parrilla', 'Pechuga de pollo con vegetales asados', 7800.00, 2, 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=500'),
('Tacos al Pastor', 'Tres tacos con carne al pastor y pina', 5500.00, 2, 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500'),
('Salmon a la Plancha', 'Filete de salmon con arroz y esparragos', 12500.00, 2, 'https://images.unsplash.com/photo-1485921325833-c519f76c4927?w=500'),
('Lasagna Bolonesa', 'Lasagna tradicional con carne y queso', 8800.00, 2, 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=500');

-- Insertar Productos de Bebidas (categoria_id = 3)
INSERT INTO productos (nombre, descripcion, precio, categoria_id, imagen_url) VALUES
('Coca Cola', 'Refresco de cola 355ml', 1500.00, 3, 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=500'),
('Agua Mineral', 'Agua mineral natural 500ml', 1200.00, 3, 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=500'),
('Jugo de Naranja', 'Jugo natural recien exprimido', 2200.00, 3, 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=500'),
('Cafe Americano', 'Cafe negro tradicional', 1800.00, 3, 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500'),
('Limonada Natural', 'Limonada natural con hierbabuena', 2000.00, 3, 'https://images.unsplash.com/photo-1523677011781-c91d1bbe2f9d?w=500'),
('Te Helado', 'Te negro helado con limon', 1800.00, 3, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500'),
('Smoothie de Fresa', 'Batido de fresa con yogurt', 2800.00, 3, 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=500'),
('Cerveza Artesanal', 'Cerveza artesanal local', 3200.00, 3, 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=500');

-- Insertar Productos de Postres (categoria_id = 4)
INSERT INTO productos (nombre, descripcion, precio, categoria_id, imagen_url) VALUES
('Cheesecake', 'Pastel de queso con frutos rojos', 4200.00, 4, 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500'),
('Brownie con Helado', 'Brownie de chocolate con helado de vainilla', 3800.00, 4, 'https://images.unsplash.com/photo-1607920591413-4ec007e70023?w=500'),
('Tiramisu', 'Postre italiano con cafe y mascarpone', 4500.00, 4, 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500'),
('Flan Napolitano', 'Flan tradicional con caramelo', 3200.00, 4, 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=500'),
('Pastel de Chocolate', 'Pastel humedo de chocolate', 3900.00, 4, 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500');

-- Insertar Productos de Desayunos (categoria_id = 5)
INSERT INTO productos (nombre, descripcion, precio, categoria_id, imagen_url) VALUES
('Huevos Rancheros', 'Huevos estrellados con salsa ranchera', 4800.00, 5, 'https://images.unsplash.com/photo-1608039755401-742074f0548d?w=500'),
('Pancakes', 'Stack de pancakes con miel de maple', 4200.00, 5, 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500'),
('Omelette de Jamon', 'Omelette con jamon y queso', 5200.00, 5, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500'),
('Chilaquiles', 'Chilaquiles verdes o rojos con pollo', 5500.00, 5, 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=500'),
('Molletes', 'Pan con frijoles y queso gratinado', 3800.00, 5, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500');

-- Insertar Productos de Ensaladas (categoria_id = 6)
INSERT INTO productos (nombre, descripcion, precio, categoria_id, imagen_url) VALUES
('Ensalada Cesar', 'Lechuga romana con aderezo Cesar y crutones', 5500.00, 6, 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=500'),
('Ensalada Griega', 'Ensalada con queso feta, aceitunas y tomate', 6200.00, 6, 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500'),
('Ensalada Caprese', 'Mozzarella fresca, tomate y albahaca', 6500.00, 6, 'https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=500'),
('Ensalada de Atun', 'Ensalada mixta con atun y vinagreta', 6800.00, 6, 'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?w=500');

SELECT 'Base de datos poblada exitosamente' AS Estado;
SELECT COUNT(*) AS 'Total Categorías' FROM categorias;
SELECT COUNT(*) AS 'Total Productos' FROM productos;
